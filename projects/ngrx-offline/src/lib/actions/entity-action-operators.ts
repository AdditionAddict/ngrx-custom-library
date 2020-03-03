import { OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

import { NxaEntityAction } from './entity-action';
import { NxaEntityOp } from './entity-op';
import { flattenArgs } from '../utils/utilities';

/**
 * Select actions concerning one of the allowed Entity operations
 * @param allowedNxaEntityOps Entity operations (e.g, NxaEntityOp.QUERY_ALL) whose actions should be selected
 * Example:
 * ```
 *  this.actions.pipe(ofNxaEntityOp(NxaEntityOp.QUERY_ALL, NxaEntityOp.QUERY_MANY), ...)
 *  this.actions.pipe(ofNxaEntityOp(...queryOps), ...)
 *  this.actions.pipe(ofNxaEntityOp(queryOps), ...)
 *  this.actions.pipe(ofNxaEntityOp(), ...) // any action with a defined `entityOp` property
 * ```
 */
export function ofNxaEntityOp<T extends NxaEntityAction>(
    allowedOps: string[] | NxaEntityOp[]
): OperatorFunction<NxaEntityAction, T>;
export function ofNxaEntityOp<T extends NxaEntityAction>(
    ...allowedOps: (string | NxaEntityOp)[]
): OperatorFunction<NxaEntityAction, T>;
export function ofNxaEntityOp<T extends NxaEntityAction>(
    ...allowedNxaEntityOps: any[]
): OperatorFunction<NxaEntityAction, T> {
    const ops: string[] = flattenArgs(allowedNxaEntityOps);
    switch (ops.length) {
        case 0:
            return filter(
                (action: NxaEntityAction): action is T =>
                    action.payload && action.payload.entityOp != null
            );
        case 1:
            const op = ops[0];
            return filter(
                (action: NxaEntityAction): action is T =>
                    action.payload && op === action.payload.entityOp
            );
        default:
            return filter(
                (action: NxaEntityAction): action is T => {
                    const entityOp = action.payload && action.payload.entityOp;
                    return entityOp && ops.some(o => o === entityOp);
                }
            );
    }
}

/**
 * Select actions concerning one of the allowed Entity types
 * @param allowedEntityNames Entity-type names (e.g, 'Hero') whose actions should be selected
 * Example:
 * ```
 *  this.actions.pipe(ofNxaEntityType(), ...) // ayn NxaEntityAction with a defined entity type property
 *  this.actions.pipe(ofNxaEntityType('Hero'), ...) // NxaEntityActions for the Hero entity
 *  this.actions.pipe(ofNxaEntityType('Hero', 'Villain', 'Sidekick'), ...)
 *  this.actions.pipe(ofNxaEntityType(...theChosen), ...)
 *  this.actions.pipe(ofNxaEntityType(theChosen), ...)
 * ```
 */
export function ofNxaEntityType<T extends NxaEntityAction>(
    allowedEntityNames?: string[]
): OperatorFunction<NxaEntityAction, T>;
export function ofNxaEntityType<T extends NxaEntityAction>(
    ...allowedEntityNames: string[]
): OperatorFunction<NxaEntityAction, T>;
export function ofNxaEntityType<T extends NxaEntityAction>(
    ...allowedEntityNames: any[]
): OperatorFunction<NxaEntityAction, T> {
    const names: string[] = flattenArgs(allowedEntityNames);
    switch (names.length) {
        case 0:
            return filter(
                (action: NxaEntityAction): action is T =>
                    action.payload && action.payload.entityName != null
            );
        case 1:
            const name = names[0];
            return filter(
                (action: NxaEntityAction): action is T =>
                    action.payload && name === action.payload.entityName
            );
        default:
            return filter(
                (action: NxaEntityAction): action is T => {
                    const entityName = action.payload && action.payload.entityName;
                    return !!entityName && names.some(n => n === entityName);
                }
            );
    }
}