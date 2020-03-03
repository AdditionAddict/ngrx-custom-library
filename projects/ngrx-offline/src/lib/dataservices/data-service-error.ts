import { NxaEntityAction } from '../actions/entity-action';
import { NxaRequestData } from './interfaces';

/**
 * Error from a DataService
 * The source error either comes from a failed HTTP response or was thrown within the service.
 * @param error the HttpErrorResponse or the error thrown by the service
 * @param requestData the HTTP request information such as the method and the url.
 */
// If extend from Error, `dse instanceof NxaDataServiceError` returns false
// in some (all?) unit tests so don't bother trying.
export class NxaDataServiceError {
    message: string | null;

    constructor(public error: any, public requestData: NxaRequestData | null) {
        this.message = typeof error === 'string' ? error : extractMessage(error);
    }
}

// Many ways the error can be shaped. These are the ways we recognize.
function extractMessage(sourceError: any): string | null {
    const { error, body, message } = sourceError;
    let errMessage: string | null = null;
    if (error) {
        // prefer HttpErrorResponse.error to its message property
        errMessage = typeof error === 'string' ? error : error.message;
    } else if (message) {
        errMessage = message;
    } else if (body) {
        // try the body if no error or message property
        errMessage = typeof body === 'string' ? body : body.error;
    }

    return typeof errMessage === 'string'
        ? errMessage
        : errMessage
            ? JSON.stringify(errMessage)
            : null;
}

/** Payload for an NxaEntityAction data service error such as QUERY_ALL_ERROR */
export interface NxaEntityActionDataServiceError {
    error: NxaDataServiceError;
    originalAction: NxaEntityAction;
}