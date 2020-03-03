import { Injectable } from '@angular/core';

import { NxaEntityOp } from './entity-op';
import {
    NxaEntityAction,
    NxaEntityActionOptions,
    NxaEntityActionPayload,
} from './entity-action';
@Injectable()
export class NxaEntityActionFactory {
    /**
     * Create an NxaEntityAction to perform an operation (op) for a particular entity type
     * (entityName) with optional data and other optional flags
     * @param entityName Name of the entity type
     * @param entityOp Operation to perform (NxaEntityOp)
     * @param [data] data for the operation
     * @param [options] additional options
     */
    create<P = any>(
        entityName: string,
        entityOp: NxaEntityOp,
        data?: P,
        options?: NxaEntityActionOptions
    ): NxaEntityAction<P>;

    /**
     * Create an NxaEntityAction to perform an operation (op) for a particular entity type
     * (entityName) with optional data and other optional flags
     * @param payload Defines the NxaEntityAction and its options
     */
    create<P = any>(payload: NxaEntityActionPayload<P>): NxaEntityAction<P>;

    // polymorphic create for the two signatures
    create<P = any>(
        nameOrPayload: NxaEntityActionPayload<P> | string,
        entityOp?: NxaEntityOp,
        data?: P,
        options?: NxaEntityActionOptions
    ): NxaEntityAction<P> {
        const payload: NxaEntityActionPayload<P> =
            typeof nameOrPayload === 'string'
                ? ({
                    ...(options || {}),
                    entityName: nameOrPayload,
                    entityOp,
                    data,
                } as NxaEntityActionPayload<P>)
                : nameOrPayload;
        return this.createCore(payload);
    }

    /**
     * Create an NxaEntityAction to perform an operation (op) for a particular entity type
     * (entityName) with optional data and other optional flags
     * @param payload Defines the NxaEntityAction and its options
     */
    protected createCore<P = any>(payload: NxaEntityActionPayload<P>) {
        const { entityName, entityOp, tag } = payload;
        if (!entityName) {
            throw new Error('Missing entity name for new action');
        }
        if (entityOp == null) {
            throw new Error('Missing NxaEntityOp for new action');
        }
        const type = this.formatActionType(entityOp, tag || entityName);
        return { type, payload };
    }

    /**
     * Create an NxaEntityAction from another NxaEntityAction, replacing properties with those from newPayload;
     * @param from Source action that is the base for the new action
     * @param newProperties New NxaEntityAction properties that replace the source action properties
     */
    createFromAction<P = any>(
        from: NxaEntityAction,
        newProperties: Partial<NxaEntityActionPayload<P>>
    ): NxaEntityAction<P> {
        return this.create({ ...from.payload, ...newProperties });
    }

    formatActionType(op: string, tag: string) {
        return `[${tag}] ${op}`;
        // return `${op} [${tag}]`.toUpperCase(); // example of an alternative
    }
}