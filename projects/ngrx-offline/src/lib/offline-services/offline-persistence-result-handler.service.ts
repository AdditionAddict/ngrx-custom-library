import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';


import { NxaEntityAction } from '../actions/entity-action';
import { NxaEntityActionFactory } from '../actions/entity-action-factory';
import { makeNxaOfflineErrorOp, makeNxaOfflineSuccessOp } from '../actions/entity-op';
import { Logger } from '../utils/interfaces';
import { NxaOfflineServiceError, NxaEntityActionOfflineServiceError } from './offline-service-error';

/**
 * Handling of responses from persistence operation
 */
export abstract class NxaOfflinePersistenceResultHandler {
    /** Handle successful result of persistence operation for an action */
    abstract handleSuccess(originalAction: NxaEntityAction): (data: any) => Action;

    /** Handle error result of persistence operation for an action */
    abstract handleError(
        originalAction: NxaEntityAction
    ): (
            error: NxaOfflineServiceError | Error
        ) => NxaEntityAction<NxaEntityActionOfflineServiceError>;
}

/**
 * Default handling of responses from persistence operation,
 * specifically an NxaEntityDataService
 */
@Injectable()
export class DefaultNxaOfflinePersistenceResultHandler
    implements NxaOfflinePersistenceResultHandler {
    constructor(
        private logger: Logger,
        private nxaEntityActionFactory: NxaEntityActionFactory
    ) { }

    /** Handle successful result of persistence operation on an NxaEntityAction */
    handleSuccess(originalAction: NxaEntityAction): (data: any) => Action {
        const successOp = makeNxaOfflineSuccessOp(originalAction.payload.entityOp);
        return (data: any) =>
            this.nxaEntityActionFactory.createFromAction(originalAction, {
                entityOp: successOp,
                data,
            });
    }

    /** Handle error result of persistence operation on an NxaEntityAction */
    handleError(
        originalAction: NxaEntityAction
    ): (
            error: NxaOfflineServiceError | Error
        ) => NxaEntityAction<NxaEntityActionOfflineServiceError> {
        const errorOp = makeNxaOfflineErrorOp(originalAction.payload.entityOp);

        return (err: NxaOfflineServiceError | Error) => {
            const error =
                err instanceof NxaOfflineServiceError ? err :
                    new NxaOfflineServiceError(
                        `Unable to execute offline operation ${originalAction.payload.entityOp} for ${originalAction.payload.data}`
                    );
            const errorData: NxaEntityActionOfflineServiceError = { error, originalAction };
            this.logger.error(errorData);
            const action = this.nxaEntityActionFactory.createFromAction<
                NxaEntityActionOfflineServiceError
            >(originalAction, {
                entityOp: errorOp,
                data: errorData,
            });
            return action;
        };
    }
}