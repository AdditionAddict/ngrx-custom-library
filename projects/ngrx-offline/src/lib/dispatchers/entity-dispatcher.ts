import { Action, Store } from '@ngrx/store';
import { IdSelector, Update } from '@ngrx/entity';

import { NxaEntityAction, NxaEntityActionOptions } from '../actions/entity-action';
import { NxaEntityActionGuard } from '../actions/entity-action-guard';
import { NxaEntityCommands } from './entity-commands';
import { NxaEntityCache } from '../reducers/entity-cache';
import { NxaEntityOp } from '../actions/entity-op';

/**
 * Dispatches EntityCollection actions to their reducers and effects.
 * The substance of the interface is in NxaEntityCommands.
 */
export interface NxaEntityDispatcher<T> extends NxaEntityCommands<T> {
    /** Name of the entity type */
    readonly entityName: string;

    /**
     * Utility class with methods to validate NxaEntityAction payloads.
     */
    readonly guard: NxaEntityActionGuard<T>;

    /** Returns the primary key (id) of this entity */
    readonly selectId: IdSelector<T>;

    /** Returns the store, scoped to the NxaEntityCache */
    readonly store: Store<NxaEntityCache>;

    /**
     * Create an {NxaEntityAction} for this entity type.
     * @param op {NxaEntityOp} the entity operation
     * @param [data] the action data
     * @param [options] additional options
     * @returns the NxaEntityAction
     */
    createNxaEntityAction<P = any>(
        op: NxaEntityOp,
        data?: P,
        options?: NxaEntityActionOptions
    ): NxaEntityAction<P>;

    /**
     * Create an {NxaEntityAction} for this entity type and
     * dispatch it immediately to the store.
     * @param op {NxaEntityOp} the entity operation
     * @param [data] the action data
     * @param [options] additional options
     * @returns the dispatched NxaEntityAction
     */
    createAndDispatch<P = any>(
        op: NxaEntityOp,
        data?: P,
        options?: NxaEntityActionOptions
    ): NxaEntityAction<P>;

    /**
     * Dispatch an Action to the store.
     * @param action the Action
     * @returns the dispatched Action
     */
    dispatch(action: Action): Action;

    /**
     * Convert an entity (or partial entity) into the `Update<T>` object
     * `update...` and `upsert...` methods take `Update<T>` args
     */
    toUpdate(entity: Partial<T>): Update<T>;
}

/**
 * Persistence operation canceled
 */
export class NxaPersistanceCanceled {
    constructor(public readonly message?: string) {
        this.message = message || 'Canceled by user';
    }
}