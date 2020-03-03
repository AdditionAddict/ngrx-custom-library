import { Injectable } from '@angular/core';

import { NxaEntityAction } from '../actions/entity-action';
import { NxaEntityCollection } from './entity-collection';
import { NxaEntityCollectionReducerMethodsFactory } from './entity-collection-reducer-methods';

export type NxaEntityCollectionReducer<T = any> = (
    collection: NxaEntityCollection<T>,
    action: NxaEntityAction
) => NxaEntityCollection<T>;

/** Create a default reducer for a specific entity collection */
@Injectable()
export class NxaEntityCollectionReducerFactory {
    constructor(private methodsFactory: NxaEntityCollectionReducerMethodsFactory) { }

    /** Create a default reducer for a collection of entities of T */
    create<T = any>(entityName: string): NxaEntityCollectionReducer<T> {
        const methods = this.methodsFactory.create<T>(entityName);

        /** Perform Actions against a particular entity collection in the NxaEntityCache */
        return function entityCollectionReducer(
            collection: NxaEntityCollection<T>,
            action: NxaEntityAction
        ): NxaEntityCollection<T> {
            const reducerMethod = methods[action.payload.entityOp];
            return reducerMethod ? reducerMethod(collection, action) : collection;
        };
    }
}