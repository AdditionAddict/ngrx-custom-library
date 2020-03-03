import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, delay, map, timeout } from 'rxjs/operators';

import { IdSelector } from '@ngrx/entity';

import {
    NxaChangeSetOperation,
    NxaChangeSet,
    NxaChangeSetItem,
    NxaChangeSetUpdate,
    excludeEmptyNxaChangeSetItems,
} from '../actions/entity-cache-change-set';
import { NxaDataServiceError } from './data-service-error';
import { NxaDefaultDataServiceConfig } from './default-data-service-config';
import { NxaEntityDefinitionService } from '../entity-metadata/entity-definition.service';
import { NxaRequestData } from './interfaces';

const updateOp = NxaChangeSetOperation.Update;

/**
 * Default data service for making remote service calls targeting the entire NxaEntityCache.
 * See NxaEntityDataService for services that target a single EntityCollection
 */
@Injectable()
export class NxaEntityCacheDataService {
    protected idSelectors: { [entityName: string]: IdSelector<any> } = {};
    protected saveDelay = 0;
    protected timeout = 0;

    constructor(
        protected entityDefinitionService: NxaEntityDefinitionService,
        protected http: HttpClient,
        @Optional() config?: NxaDefaultDataServiceConfig
    ) {
        const { saveDelay = 0, timeout: to = 0 } = config || {};
        this.saveDelay = saveDelay;
        this.timeout = to;
    }

    /**
     * Save changes to multiple entities across one or more entity collections.
     * Server endpoint must understand the essential NxaSaveEntities protocol,
     * in particular the NxaChangeSet interface (except for Update<T>).
     * This implementation extracts the entity changes from a NxaChangeSet Update<T>[] and sends those.
     * It then reconstructs Update<T>[] in the returned observable result.
     * @param NxaChangeSet  An array of SaveEntityItems.
     * Each SaveEntityItem describe a change operation for one or more entities of a single collection,
     * known by its 'entityName'.
     * @param url The server endpoint that receives this request.
     */
    NxaSaveEntities(NxaChangeSet: NxaChangeSet, url: string): Observable<NxaChangeSet> {
        NxaChangeSet = this.filterNxaChangeSet(NxaChangeSet);
        // Assume server doesn't understand @ngrx/entity Update<T> structure;
        // Extract the entity changes from the Update<T>[] and restore on the return from server
        NxaChangeSet = this.flattenUpdates(NxaChangeSet);

        let result$: Observable<NxaChangeSet> = this.http
            .post<NxaChangeSet>(url, NxaChangeSet)
            .pipe(
                map(result => this.restoreUpdates(result)),
                catchError(this.handleError({ method: 'POST', url, data: NxaChangeSet }))
            );

        if (this.timeout) {
            result$ = result$.pipe(timeout(this.timeout));
        }

        if (this.saveDelay) {
            result$ = result$.pipe(delay(this.saveDelay));
        }

        return result$;
    }

    // #region helpers
    protected handleError(reqData: NxaRequestData) {
        return (err: any) => {
            const error = new NxaDataServiceError(err, reqData);
            return throwError(error);
        };
    }

    /**
     * Filter NxaChangeSet to remove unwanted NxaChangeSetItems.
     * This implementation excludes null and empty NxaChangeSetItems.
     * @param NxaChangeSet NxaChangeSet with changes to filter
     */
    protected filterNxaChangeSet(NxaChangeSet: NxaChangeSet): NxaChangeSet {
        return excludeEmptyNxaChangeSetItems(NxaChangeSet);
    }

    /**
     * Convert the entities in update changes from @ngrx Update<T> structure to just T.
     * Reverse of restoreUpdates().
     */
    protected flattenUpdates(NxaChangeSet: NxaChangeSet): NxaChangeSet {
        let changes = NxaChangeSet.changes;
        if (changes.length === 0) {
            return NxaChangeSet;
        }
        let hasMutated = false;
        changes = changes.map(item => {
            if (item.op === updateOp && item.entities.length > 0) {
                hasMutated = true;
                return {
                    ...item,
                    entities: (item as NxaChangeSetUpdate).entities.map(u => u.changes),
                };
            } else {
                return item;
            }
        }) as NxaChangeSetItem[];
        return hasMutated ? { ...NxaChangeSet, changes } : NxaChangeSet;
    }

    /**
     * Convert the flattened T entities in update changes back to @ngrx Update<T> structures.
     * Reverse of flattenUpdates().
     */
    protected restoreUpdates(NxaChangeSet: NxaChangeSet): NxaChangeSet {
        if (NxaChangeSet == null) {
            // Nothing? Server probably responded with 204 - No Content because it made no changes to the inserted or updated entities
            return NxaChangeSet;
        }
        let changes = NxaChangeSet.changes;
        if (changes.length === 0) {
            return NxaChangeSet;
        }
        let hasMutated = false;
        changes = changes.map(item => {
            if (item.op === updateOp) {
                // These are entities, not Updates; convert back to Updates
                hasMutated = true;
                const selectId = this.getIdSelector(item.entityName);
                return {
                    ...item,
                    entities: item.entities.map((u: any) => ({
                        id: selectId(u),
                        changes: u,
                    })),
                } as NxaChangeSetUpdate;
            } else {
                return item;
            }
        }) as NxaChangeSetItem[];
        return hasMutated ? { ...NxaChangeSet, changes } : NxaChangeSet;
    }

    /**
     * Get the id (primary key) selector function for an entity type
     * @param entityName name of the entity type
     */
    protected getIdSelector(entityName: string) {
        let idSelector = this.idSelectors[entityName];
        if (!idSelector) {
            idSelector = this.entityDefinitionService.getDefinition(entityName)
                .selectId;
            this.idSelectors[entityName] = idSelector;
        }
        return idSelector;
    }
    // #endregion helpers
}