import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import {
    NxaDataServiceError,
    NxaEntityActionDataServiceError,
} from './data-service-error';
import { NxaEntityAction } from '../actions/entity-action';
import { NxaEntityActionFactory } from '../actions/entity-action-factory';
import { makeNxaErrorOp, makeNxaSuccessOp } from '../actions/entity-op';
import { Logger } from '../utils/interfaces';

/**
 * Handling of responses from persistence operation
 */
export abstract class NxaPersistenceResultHandler {
    /** Handle successful result of persistence operation for an action */
    abstract handleSuccess(originalAction: NxaEntityAction): (data: any) => Action;

    /** Handle error result of persistence operation for an action */
    abstract handleError(
        originalAction: NxaEntityAction
    ): (
            error: NxaDataServiceError | Error
        ) => NxaEntityAction<NxaEntityActionDataServiceError>;
}

/**
 * Default handling of responses from persistence operation,
 * specifically an NxaEntityDataService
 */
@Injectable()
export class DefaultNxaPersistenceResultHandler
    implements NxaPersistenceResultHandler {
    constructor(
        private logger: Logger,
        private NxaEntityActionFactory: NxaEntityActionFactory
    ) { }

    /** Handle successful result of persistence operation on an NxaEntityAction */
    handleSuccess(originalAction: NxaEntityAction): (data: any) => Action {
        const successOp = makeNxaSuccessOp(originalAction.payload.entityOp);
        return (data: any) =>
            this.NxaEntityActionFactory.createFromAction(originalAction, {
                entityOp: successOp,
                data,
            });
    }

    /** Handle error result of persistence operation on an NxaEntityAction */
    handleError(
        originalAction: NxaEntityAction
    ): (
            error: NxaDataServiceError | Error
        ) => NxaEntityAction<NxaEntityActionDataServiceError> {
        const errorOp = makeNxaErrorOp(originalAction.payload.entityOp);

        return (err: NxaDataServiceError | Error) => {
            const error =
                err instanceof NxaDataServiceError ? err : new NxaDataServiceError(err, null);
            const errorData: NxaEntityActionDataServiceError = { error, originalAction };
            this.logger.error(errorData);
            const action = this.NxaEntityActionFactory.createFromAction<
                NxaEntityActionDataServiceError
            >(originalAction, {
                entityOp: errorOp,
                data: errorData,
            });
            return action;
        };
    }
}