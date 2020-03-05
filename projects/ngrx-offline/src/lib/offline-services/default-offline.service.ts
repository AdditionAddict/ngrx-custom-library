import { Injectable, Optional } from '@angular/core';

import { Observable, of, Subscriber } from 'rxjs';
import { share, concatMap, withLatestFrom, map, tap } from 'rxjs/operators';

import { Update } from '@ngrx/entity';

import { NxaOfflineServiceError } from './offline-service-error';
import { NxaDefaultOfflineServiceConfig } from './default-offline-service-config';
import { NxaQueryParams } from '../dataservices/interfaces';
import { NxaChangeType, NxaEntityCollection } from '../reducers/entity-collection';
import { NxaEntityCollectionOfflineService, Changed } from './default-offline-interface';
import { NxaEntitySelectorsFactory, NxaCollectionSelectors } from '../selectors/entity-selectors';
import { Store } from '@ngrx/store';




/**
 * A basic, generic entity offline service
 * suitable for persistence of most entities.
 */
export class NxaDefaultOfflineService<T> implements NxaEntityCollectionOfflineService<T> {
    protected _name: string;
    protected entityName: string;

    protected dbVersion: number;
    protected dbName: string;
    protected idbConfig: { [key: string]: { keyPath: string } }
    protected selectKeyStr: string

    selectors: NxaCollectionSelectors<T>

    get name() {
        return this._name;
    }

    constructor(
        entityName: string,
        private nxaEntitySelectorsFactory: NxaEntitySelectorsFactory,
        private store: Store<NxaEntityCollection<T>>,
        config?: NxaDefaultOfflineServiceConfig,
    ) {
        this._name = `${entityName} NxaDefaultOfflineService`;
        this.entityName = entityName;
        const {
            dbName = 'ngrx-offline-entity-stores',
            dbVersion = 1,
            idbConfig = {}
        } = config || {};
        this.dbName = dbName
        this.dbVersion = dbVersion
        this.idbConfig = idbConfig

        this.selectors = this.nxaEntitySelectorsFactory.createNxaCollectionSelectors<T>(entityName)
        this.selectKeyStr = this.idbConfig[entityName].keyPath
    }

    add(entity: T): Observable<T> {
        const entityOrError =
            entity || new Error(`No "${this.entityName}" entity to add`);
        if (entityOrError instanceof Error) {
            throw new NxaOfflineServiceError(entityOrError.message)
        }
        return this.openDB$().pipe(
            concatMap(db => this.storePutter<T>(db, this.entityName, entity, NxaChangeType.Added)),
            map(changed => {
                const { changeType: changeType, originalValue: originalValue, ...value } = changed
                return value as T
            })
        );
    }

    delete(key: number | string): Observable<number | string> {
        let err: Error | undefined;
        if (key == null) {
            err = new Error(`No "${this.entityName}" key to delete`);
        }
        if (err instanceof Error) {
            throw new NxaOfflineServiceError(err.message)
        }
        return this.openDB$().pipe(
            withLatestFrom(
                this.store.select(this.selectors.selectEntityMap),
                this.store.select(this.selectors.selectNxaChangeState)
            ),
            map(([db, entityMap, changeState]) => {
                let value;
                let shouldPut = true
                const collectionValue = entityMap[key]
                const chgState = changeState[key] || { changeType: NxaChangeType.Unchanged }
                const { originalValue, changeType } = chgState;

                switch (changeType) {
                    case NxaChangeType.Unchanged: {
                        // put
                        value = collectionValue
                        break
                    }
                    case NxaChangeType.Added: {
                        // delete
                        value = collectionValue[this.selectKeyStr]
                        shouldPut = false
                        break
                    }
                    case NxaChangeType.Deleted: {
                        // put
                        value = originalValue;
                        break
                    }
                    case NxaChangeType.Updated: {
                        // put
                        value = originalValue;
                        break
                    }
                }

                return [
                    db,
                    value,
                    shouldPut
                ]
            }),
            tap(x => console.log(`delete::${x}`)),
            concatMap(([db, value, shouldPut]) => {
                if (shouldPut) {
                    return this.storePutter<T>(db, this.entityName, value, NxaChangeType.Deleted)
                } else {
                    return this.storeDeleter<string | number>(db, this.entityName, value)
                }
            }),
            map(changedOrkey => changedOrkey[this.selectKeyStr] || changedOrkey)
        );
    }

    getAll(): Observable<T[]> {
        return of(null)
    }

    getById(key: number | string): Observable<T> {
        let err: Error | undefined;
        if (key == null) {
            err = new Error(`No "${this.entityName}" key to get`);
        }
        return of(null)
    }

    getWithQuery(queryParams: NxaQueryParams | string): Observable<T[]> {
        const qParams =
            typeof queryParams === 'string'
                ? { fromString: queryParams }
                : { fromObject: queryParams };
        return of(null)
    }

    update(update: Update<T>): Observable<T> {
        const key = update && update.id;
        const updateOrError =
            key == null
                ? new Error(`No "${this.entityName}" update data or id`)
                : update.changes;
        return this.openDB$().pipe(
            withLatestFrom(
                this.store.select(this.selectors.selectEntityMap),
                this.store.select(this.selectors.selectNxaChangeState)
            ),
            map(([db, entityMap, changeState]) => {
                let value;
                let useChangeType = NxaChangeType.Updated

                const collectionValue = entityMap[key]
                const chgState = changeState[key] || { changeType: NxaChangeType.Unchanged }
                const { originalValue, changeType } = chgState;

                switch (changeType) {
                    case NxaChangeType.Unchanged: {
                        // put, updated
                        value = {
                            ...collectionValue,
                            ...update.changes
                        };
                        break
                    }
                    case NxaChangeType.Added: {
                        // put, added
                        value = {
                            ...collectionValue,
                            ...update.changes
                        };
                        break
                    }
                    case NxaChangeType.Deleted: {
                        // throw
                        throw new NxaOfflineServiceError(`Cannot update deleted entity`)
                    }
                    case NxaChangeType.Updated: {
                        // put, updated
                        value = {
                            ...originalValue,
                            ...collectionValue,
                            ...update.changes
                        };
                        break
                    }
                }

                return [
                    db,
                    value,
                    useChangeType,
                    originalValue || collectionValue
                ]
            }),
            tap(x => console.log(`delete::${x}`)),
            concatMap(([db, value, changeType, originalValue]) => {
                return this.storePutter<T>(db, this.entityName, value, changeType, originalValue)
            }),
            map(changed => {
                const { originalValue, changeType, ...value } = changed;
                return value as T
            })
        );
    }

    // Important! Only call if the backend service supports upserts as a POST to the target URL
    upsert(entity: T): Observable<T> {
        const key = entity[this.selectKeyStr]
        const entityOrError =
            entity || new Error(`No "${this.entityName}" entity to upsert`);
        return this.openDB$().pipe(
            withLatestFrom(
                this.store.select(this.selectors.selectEntityMap),
                this.store.select(this.selectors.selectNxaChangeState)
            ),
            map(([db, entityMap, changeState]) => {
                let value;
                let useChangeType = NxaChangeType.Updated

                const collectionValue = entityMap[key]
                const chgState = changeState[key] || { changeType: NxaChangeType.Unchanged }
                const { originalValue, changeType } = chgState;

                switch (changeType) {
                    case NxaChangeType.Unchanged: {
                        // put, updated
                        value = {
                            ...collectionValue,
                            ...entity
                        };
                        break
                    }
                    case NxaChangeType.Added: {
                        // put, added
                        value = {
                            ...collectionValue,
                            ...entity
                        };
                        break
                    }
                    case NxaChangeType.Deleted: {
                        // throw
                        throw new NxaOfflineServiceError(`Cannot upsert deleted entity`)
                    }
                    case NxaChangeType.Updated: {
                        // put, updated
                        value = {
                            ...originalValue,
                            ...collectionValue,
                            ...entity
                        };
                        console.log(`Updated::${JSON.stringify(value)}`)
                        console.log(`originalValue::${JSON.stringify(originalValue)}`)
                        console.log(`collectionValue::${JSON.stringify(collectionValue)}`)
                        console.log(`entity::${JSON.stringify(entity)}`)
                        break
                    }
                }

                return [
                    db,
                    value,
                    useChangeType,
                    originalValue || collectionValue
                ]
            }),
            tap(x => console.log(`upsert::${x}`)),
            concatMap(([db, value, changeType, originalValue]) => {
                return this.storePutter<T>(db, this.entityName, value, changeType, originalValue)
            }),
            map(changed => {
                const { originalValue, changeType, ...value } = changed;
                return value as T
            })
        );
    }

    openDB$(): Observable<IDBDatabase> {
        // console.log("openDB");
        const INDEXEDDB_NAME = this.dbName;
        const INDEXEDDB_VERSION = this.dbVersion;

        const observable = new Observable<IDBDatabase>(subscriber => {
            const request: IDBOpenDBRequest = indexedDB.open(
                INDEXEDDB_NAME,
                INDEXEDDB_VERSION
            );

            this.handleSuccess<IDBDatabase>(request, subscriber);
            this.handleError(request, subscriber);

            request.onupgradeneeded = (event: Event) => {
                const db = (event.target as any).result;
                console.log(`IndexedDB Upgrade, Version ${INDEXEDDB_VERSION}`);
                this.upgradeDB(db);
            };

            request.onblocked = (event: Event) => {
                const blocked = (event.target as any).result;
                console.log(`onblocked::${blocked}`);
                subscriber.error(blocked);
                subscriber.complete();
            };
        });

        return observable.pipe(share()) as Observable<IDBDatabase>;
    }


    private upgradeDB(db: IDBDatabase) {
        /** Create list of current store names */
        let storeNames = [] as string[];
        for (let i = 0; i < db.objectStoreNames.length; i++) {
            const entityKey = db.objectStoreNames.item(i);
            storeNames.push(entityKey);
        }

        /** Remove non-defined stores */
        for (const entityKey of storeNames) {
            if (!Object.keys(this.idbConfig).includes(entityKey)) {
                db.deleteObjectStore(entityKey);
            }
        }

        /** Add defined stores */
        for (const entityKey of Object.keys(this.idbConfig)) {
            if (!storeNames.includes(entityKey)) {
                db.createObjectStore(entityKey, {
                    keyPath: this.idbConfig[entityKey].keyPath
                });
            }
        }
    }

    deleteDB(INDEXEDDB_NAME?) {
        console.log("deleteDB")
        const idbName = INDEXEDDB_NAME ? INDEXEDDB_NAME : this.dbName;
        const request = indexedDB.deleteDatabase(idbName);

        request.onsuccess = (event: Event) => {
            console.log(`deleteDB::onsuccess::${idbName}`);
        };

        request.onerror = (event: Event) => {
            console.log("deleteDB::onerror");
        };

        request.onblocked = (event: Event) => {
            console.log(`deleteDB::onblocked::${idbName}::${event}`);
        };

        request.onupgradeneeded = (event: Event) => {
            console.log("deleteDB::onupgradeneeded");
        };


    }

    private storePutter<T>(db, target, value, changeType, originalValue?) {
        return new Observable<Changed<T>>(subscriber => {
            const entity = originalValue
                ? {
                    ...value,
                    changeType,
                    originalValue
                }
                : {
                    ...value,
                    changeType
                };
            const tx = db.transaction(target, "readwrite");
            const write = tx.objectStore(target).put(entity);
            this.handleSuccess<Changed<T>>(write, subscriber, db, entity);
            this.handleError(write, subscriber);
        });
    }

    private storeDeleter<T>(db, target, value) {
        console.log(`storeDeleter`)
        return new Observable<T>(subscriber => {
            const tx = db.transaction(target, "readwrite");
            const deleteRequest = tx.objectStore(target).delete(value);
            console.log(`storeDeleter::${value}`)
            this.handleSuccess<T>(deleteRequest, subscriber, db, value);
            deleteRequest.onerror = (event: Event) => {
                const error = (event.target as any).error;
                console.log(`error::${error}`);
                subscriber.error(error);
                subscriber.complete();
            };

        });
    }

    private handleError<T>(idbRequest: IDBRequest, subscriber: Subscriber<T>) {
        idbRequest.onerror = (event: Event) => {
            const error = (event.target as any).error;
            console.log(`error::${error}`);
            subscriber.error(error);
            subscriber.complete();
        };
    }

    private handleSuccess<T>(
        idbRequest: IDBRequest,
        subscriber: Subscriber<T>,
        db?: IDBDatabase,
        value?: T
    ) {
        console.log(`handleSuccess`)
        idbRequest.onsuccess = (event: Event) => {
            const data = (event.target as any).result as T;
            console.log(`onsuccess::${data}`);
            if (!!db) {
                // console.log(`closed db`)
                db.close();
            }
            subscriber.next(value ? value : data);
            subscriber.complete();
        };
    }

}

/**
 * Create a basic, generic entity offline service
 * suitable for persistence of most entities.
 */
@Injectable()
export class NxaDefaultOfflineServiceFactory {
    constructor(
        private nxaEntitySelectorsFactory: NxaEntitySelectorsFactory,
        private store: Store<NxaEntityCollection<any>>,
        @Optional() protected config?: NxaDefaultOfflineServiceConfig
    ) {
        config = config || {};
    }

    /**
     * Create a default {NxaEntityCollectionDataService} for the given entity type
     * @param entityName {string} Name of the entity type for this offline service
     */
    create<T>(entityName: string): NxaEntityCollectionOfflineService<T> {
        return new NxaDefaultOfflineService(
            entityName,
            this.nxaEntitySelectorsFactory,
            this.store,
            this.config
        );
    }
}