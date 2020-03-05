import { NxaEntityAction } from '../actions/entity-action';

/**
 * Error from an OfflineService
 * @param error the HttpErrorResponse or the error thrown by the service
 */

// If extend from Error, `dse instanceof NxaDataServiceError` returns false
// in some (all?) unit tests so don't bother trying.
export class NxaOfflineServiceError {
    message: string | null;

    constructor(public error: string) {
        this.message = error
    }
}

/** Payload for an NxaEntityAction offline service error such as QUERY_ALL_OFFLINE_ERROR */
export interface NxaEntityActionOfflineServiceError {
    error: NxaOfflineServiceError;
    originalAction: NxaEntityAction;
}