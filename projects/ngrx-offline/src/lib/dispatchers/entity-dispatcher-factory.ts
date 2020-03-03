import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Action, Store, ScannedActionsSubject } from '@ngrx/store';
import { IdSelector } from '@ngrx/entity';
import { Observable, Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { CorrelationIdGenerator } from '../utils/correlation-id-generator';
import { NxaEntityDispatcherDefaultOptions } from './entity-dispatcher-default-options';
import { defaultSelectId } from '../utils/utilities';
import { NxaEntityActionFactory } from '../actions/entity-action-factory';
import { NxaEntityCache } from '../reducers/entity-cache';
import {
    NxaEntityCacheSelector,
    NXA_ENTITY_CACHE_SELECTOR_TOKEN,
} from '../selectors/entity-cache-selector';
import { NxaEntityDispatcher } from './entity-dispatcher';
import { NxaEntityDispatcherBase } from './entity-dispatcher-base';

/** Creates NxaEntityDispatchers for entity collections */
@Injectable()
export class NxaEntityDispatcherFactory implements OnDestroy {
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     */
    reducedActions$: Observable<Action>;
    private raSubscription: Subscription;

    constructor(
        private NxaEntityActionFactory: NxaEntityActionFactory,
        private store: Store<NxaEntityCache>,
        private entityDispatcherDefaultOptions: NxaEntityDispatcherDefaultOptions,
        @Inject(ScannedActionsSubject) scannedActions$: Observable<Action>,
        @Inject(NXA_ENTITY_CACHE_SELECTOR_TOKEN)
        private entityCacheSelector: NxaEntityCacheSelector,
        private correlationIdGenerator: CorrelationIdGenerator
    ) {
        // Replay because sometimes in tests will fake data service with synchronous observable
        // which makes subscriber miss the dispatched actions.
        // Of course that's a testing mistake. But easy to forget, leading to painful debugging.
        this.reducedActions$ = scannedActions$.pipe(shareReplay(1));
        // Start listening so late subscriber won't miss the most recent action.
        this.raSubscription = this.reducedActions$.subscribe();
    }

    /**
     * Create an `NxaEntityDispatcher` for an entity type `T` and store.
     */
    create<T>(
        /** Name of the entity type */
        entityName: string,
        /**
         * Function that returns the primary key for an entity `T`.
         * Usually acquired from `NxaEntityDefinition` metadata.
         */
        selectId: IdSelector<T> = defaultSelectId,
        /** Defaults for options that influence dispatcher behavior such as whether
         * `add()` is optimistic or pessimistic;
         */
        defaultOptions: Partial<NxaEntityDispatcherDefaultOptions> = {}
    ): NxaEntityDispatcher<T> {
        // merge w/ defaultOptions with injected defaults
        const options: NxaEntityDispatcherDefaultOptions = {
            ...this.entityDispatcherDefaultOptions,
            ...defaultOptions,
        };
        return new NxaEntityDispatcherBase<T>(
            entityName,
            this.NxaEntityActionFactory,
            this.store,
            selectId,
            options,
            this.reducedActions$,
            this.entityCacheSelector,
            this.correlationIdGenerator
        );
    }

    ngOnDestroy() {
        this.raSubscription.unsubscribe();
    }
}