import { Update } from '@ngrx/entity';

export enum NxaChangeSetOperation {
    Add = 'Add',
    Delete = 'Delete',
    Update = 'Update',
    Upsert = 'Upsert',
}
export interface NxaChangeSetAdd<T = any> {
    op: NxaChangeSetOperation.Add;
    entityName: string;
    entities: T[];
}

export interface NxaChangeSetDelete {
    op: NxaChangeSetOperation.Delete;
    entityName: string;
    entities: string[] | number[];
}

export interface NxaChangeSetUpdate<T = any> {
    op: NxaChangeSetOperation.Update;
    entityName: string;
    entities: Update<T>[];
}

export interface NxaChangeSetUpsert<T = any> {
    op: NxaChangeSetOperation.Upsert;
    entityName: string;
    entities: T[];
}

/**
 * A entities of a single entity type, which are changed in the same way by a NxaChangeSetOperation
 */
export type NxaChangeSetItem =
    | NxaChangeSetAdd
    | NxaChangeSetDelete
    | NxaChangeSetUpdate
    | NxaChangeSetUpsert;

/*
 * A set of entity Changes, typically to be saved.
 */
export interface NxaChangeSet<T = any> {
    /** An array of NxaChangeSetItems to be processed in the array order */
    changes: NxaChangeSetItem[];

    /**
     * An arbitrary, serializable object that should travel with the NxaChangeSet.
     * Meaningful to the NxaChangeSet producer and consumer. Ignored by @@ngrx/action.
     */
    extras?: T;

    /** An arbitrary string, identifying the NxaChangeSet and perhaps its purpose */
    tag?: string;
}

/**
 * Factory to create a NxaChangeSetItem for a NxaChangeSetOperation
 */
export class NxaChangeSetItemFactory {
    /** Create the NxaChangeSetAdd for new entities of the given entity type */
    add<T>(entityName: string, entities: T | T[]): NxaChangeSetAdd<T> {
        entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
        return { entityName, op: NxaChangeSetOperation.Add, entities };
    }

    /** Create the NxaChangeSetDelete for primary keys of the given entity type */
    delete(
        entityName: string,
        keys: number | number[] | string | string[]
    ): NxaChangeSetDelete {
        const ids = Array.isArray(keys)
            ? keys
            : keys
                ? ([keys] as string[] | number[])
                : [];
        return { entityName, op: NxaChangeSetOperation.Delete, entities: ids };
    }

    /** Create the NxaChangeSetUpdate for Updates of entities of the given entity type */
    update<T extends { id: string | number }>(
        entityName: string,
        updates: Update<T> | Update<T>[]
    ): NxaChangeSetUpdate<T> {
        updates = Array.isArray(updates) ? updates : updates ? [updates] : [];
        return { entityName, op: NxaChangeSetOperation.Update, entities: updates };
    }

    /** Create the NxaChangeSetUpsert for new or existing entities of the given entity type */
    upsert<T>(entityName: string, entities: T | T[]): NxaChangeSetUpsert<T> {
        entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
        return { entityName, op: NxaChangeSetOperation.Upsert, entities };
    }
}

/**
 * Instance of a factory to create a NxaChangeSetItem for a NxaChangeSetOperation
 */
export const nxaChangeSetItemFactory = new NxaChangeSetItemFactory();

/**
 * Return NxaChangeSet after filtering out null and empty NxaChangeSetItems.
 * @param NxaChangeSet NxaChangeSet with changes to filter
 */
export function excludeEmptyNxaChangeSetItems(NxaChangeSet: NxaChangeSet): NxaChangeSet {
    NxaChangeSet = NxaChangeSet && NxaChangeSet.changes ? NxaChangeSet : { changes: [] };
    const changes = NxaChangeSet.changes.filter(
        c => c != null && c.entities && c.entities.length > 0
    );
    return { ...NxaChangeSet, changes };
}