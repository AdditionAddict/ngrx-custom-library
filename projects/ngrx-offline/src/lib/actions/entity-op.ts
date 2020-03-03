// Ensure that these suffix values and the EntityOp s@@ngrx/actionuffixes match
// Cannot do that programmatically.

/** General purpose entity action operations, good for any entity type */
export enum EntityOp {
    // Persistance operations
    CANCEL_PERSIST = '@@ngrx/action/cancel-persist',
    CANCELED_PERSIST = '@@ngrx/action/canceled-persist',

    QUERY_ALL = '@@ngrx/action/query-all',
    QUERY_ALL_SUCCESS = '@@ngrx/action/query-all/success',
    QUERY_ALL_ERROR = '@@ngrx/action/query-all/error',

    QUERY_LOAD = '@@ngrx/action/query-load',
    QUERY_LOAD_SUCCESS = '@@ngrx/action/query-load/success',
    QUERY_LOAD_ERROR = '@@ngrx/action/query-load/error',

    QUERY_MANY = '@@ngrx/action/query-many',
    QUERY_MANY_SUCCESS = '@@ngrx/action/query-many/success',
    QUERY_MANY_ERROR = '@@ngrx/action/query-many/error',

    QUERY_BY_KEY = '@@ngrx/action/query-by-key',
    QUERY_BY_KEY_SUCCESS = '@@ngrx/action/query-by-key/success',
    QUERY_BY_KEY_ERROR = '@@ngrx/action/query-by-key/error',

    SAVE_ADD_MANY = '@@ngrx/action/save/add-many',
    SAVE_ADD_MANY_ERROR = '@@ngrx/action/save/add-many/error',
    SAVE_ADD_MANY_SUCCESS = '@@ngrx/action/save/add-many/success',

    SAVE_ADD_ONE = '@@ngrx/action/save/add-one',
    SAVE_ADD_ONE_ERROR = '@@ngrx/action/save/add-one/error',
    SAVE_ADD_ONE_SUCCESS = '@@ngrx/action/save/add-one/success',

    SAVE_DELETE_MANY = '@@ngrx/action/save/delete-many',
    SAVE_DELETE_MANY_SUCCESS = '@@ngrx/action/save/delete-many/success',
    SAVE_DELETE_MANY_ERROR = '@@ngrx/action/save/delete-many/error',

    SAVE_DELETE_ONE = '@@ngrx/action/save/delete-one',
    SAVE_DELETE_ONE_SUCCESS = '@@ngrx/action/save/delete-one/success',
    SAVE_DELETE_ONE_ERROR = '@@ngrx/action/save/delete-one/error',

    SAVE_UPDATE_MANY = '@@ngrx/action/save/update-many',
    SAVE_UPDATE_MANY_SUCCESS = '@@ngrx/action/save/update-many/success',
    SAVE_UPDATE_MANY_ERROR = '@@ngrx/action/save/update-many/error',

    SAVE_UPDATE_ONE = '@@ngrx/action/save/update-one',
    SAVE_UPDATE_ONE_SUCCESS = '@@ngrx/action/save/update-one/success',
    SAVE_UPDATE_ONE_ERROR = '@@ngrx/action/save/update-one/error',

    // Use only if the server supports upsert;
    SAVE_UPSERT_MANY = '@@ngrx/action/save/upsert-many',
    SAVE_UPSERT_MANY_SUCCESS = '@@ngrx/action/save/upsert-many/success',
    SAVE_UPSERT_MANY_ERROR = '@@ngrx/action/save/upsert-many/error',

    // Use only if the server supports upsert;
    SAVE_UPSERT_ONE = '@@ngrx/action/save/upsert-one',
    SAVE_UPSERT_ONE_SUCCESS = '@@ngrx/action/save/upsert-one/success',
    SAVE_UPSERT_ONE_ERROR = '@@ngrx/action/save/upsert-one/error',

    // Cache operations
    ADD_ALL = '@@ngrx/action/add-all',
    ADD_MANY = '@@ngrx/action/add-many',
    ADD_ONE = '@@ngrx/action/add-one',
    REMOVE_ALL = '@@ngrx/action/remove-all',
    REMOVE_MANY = '@@ngrx/action/remove-many',
    REMOVE_ONE = '@@ngrx/action/remove-one',
    UPDATE_MANY = '@@ngrx/action/update-many',
    UPDATE_ONE = '@@ngrx/action/update-one',
    UPSERT_MANY = '@@ngrx/action/upsert-many',
    UPSERT_ONE = '@@ngrx/action/upsert-one',

    COMMIT_ALL = '@@ngrx/action/commit-all',
    COMMIT_MANY = '@@ngrx/action/commit-many',
    COMMIT_ONE = '@@ngrx/action/commit-one',
    UNDO_ALL = '@@ngrx/action/undo-all',
    UNDO_MANY = '@@ngrx/action/undo-many',
    UNDO_ONE = '@@ngrx/action/undo-one',

    SET_CHANGE_STATE = '@@ngrx/action/set-change-state',
    SET_COLLECTION = '@@ngrx/action/set-collection',
    SET_FILTER = '@@ngrx/action/set-filter',
    SET_LOADED = '@@ngrx/action/set-loaded',
    SET_LOADING = '@@ngrx/action/set-loading',
}

/** "Success" suffix appended to EntityOps that are successful.*/
export const OP_SUCCESS = '/success';

/** "Error" suffix appended to EntityOps that have failed.*/
export const OP_ERROR = '/error';

/** Make the error EntityOp corresponding to the given EntityOp */
export function makeErrorOp(op: EntityOp): EntityOp {
    return <EntityOp>(op + OP_ERROR);
}

/** Make the success EntityOp corresponding to the given EntityOp */
export function makeSuccessOp(op: EntityOp): EntityOp {
    return <EntityOp>(op + OP_SUCCESS);
}