import { Action } from '@ngrx/store';

import { NxaEntityOp } from './entity-op';
import { NxaMergeStrategy } from './merge-strategy';

/** Action concerning an entity collection. */
export interface NxaEntityAction<P = any> extends Action {
    readonly type: string;
    readonly payload: NxaEntityActionPayload<P>;
}

/** Options of an NxaEntityAction */
export interface NxaEntityActionOptions {
    /** Correlate related NxaEntityActions, particularly related saves. Must be serializable. */
    readonly correlationId?: any;
    /** True if should perform action optimistically (before server responds) */
    readonly isOptimistic?: boolean;
    readonly mergeStrategy?: NxaMergeStrategy;
    /** The tag to use in the action's type. The entityName if no tag specified. */
    readonly tag?: string;

    // Mutable actions are BAD.
    // Unfortunately, these mutations are the only way to stop @ngrx/effects
    // from processing these actions.

    /**
     * The action was determined (usually by a reducer) to be in error.
     * Downstream effects should not process but rather treat it as an error.
     */
    error?: Error;

    /**
     * Downstream effects should skip processing this action but should return
     * an innocuous Observable<Action> of success.
     */
    skip?: boolean;
}

/** Payload of an NxaEntityAction */
export interface NxaEntityActionPayload<P = any> extends NxaEntityActionOptions {
    readonly entityName: string;
    readonly entityOp: NxaEntityOp;
    readonly data?: P;
}