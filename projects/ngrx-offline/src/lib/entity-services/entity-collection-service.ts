import { NxaEntityAction, NxaEntityActionOptions } from '../actions/entity-action';
import { NxaEntityCommands } from '../dispatchers/entity-commands';
import { NxaEntityDispatcher } from '../dispatchers/entity-dispatcher';
import { NxaEntityOp } from '../actions/entity-op';
import { NxaEntitySelectors$ } from '../selectors/entity-selectors$';
import { NxaEntitySelectors } from '../selectors/entity-selectors';

// tslint:disable:member-ordering

/**
 * A facade for managing
 * a cached collection of T entities in the ngrx store.
 */
export interface NxaEntityCollectionService<T>
    extends NxaEntityCommands<T>,
    NxaEntitySelectors$<T> {
    /**
     * Create an {NxaEntityAction} for this entity type.
     * @param op {NxaEntityOp} the entity operation
     * @param [data] the action data
     * @param [options] additional options
     * @returns the NxaEntityAction
     */
    createNxaEntityAction(
        op: NxaEntityOp,
        payload?: any,
        options?: NxaEntityActionOptions
    ): NxaEntityAction<T>;

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

    /** Dispatcher of NxaEntityCommands (NxaEntityActions) */
    readonly dispatcher: NxaEntityDispatcher<T>;

    /** Name of the entity type for this collection service */
    readonly entityName: string;

    /** All selector functions of the entity collection */
    readonly selectors: NxaEntitySelectors<T>;

    /** All selectors$ (observables of the selectors of entity collection properties) */
    readonly selectors$: NxaEntitySelectors$<T>;
}