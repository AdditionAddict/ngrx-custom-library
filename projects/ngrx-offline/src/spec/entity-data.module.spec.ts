import { Injectable, InjectionToken } from '@angular/core';
import {
    Action,
    ActionReducer,
    MetaReducer,
    Store,
    StoreModule,
} from '@ngrx/store';
import { Actions, EffectsModule, createEffect } from '@ngrx/effects';

// Not using marble testing
import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';

import { NxaEntityCache } from '../lib/reducers/entity-cache';
import { persistNxaOps, NxaEntityEffects } from '../lib/effects/entity-effects';
import { ofNxaEntityOp } from '../lib/actions/entity-action-operators';
import { NxaEntityAction } from '../lib/actions/entity-action';
import { NxaEntityActionFactory } from '../lib/actions/entity-action-factory';
import { NxaEntityDataModule } from '../lib/entity-data.module';
import { NxaEntityCacheEffects } from '../lib/effects/entity-cache-effects';
import { NxaEntityOp } from '../lib/actions/entity-op';
import { NxaEntityCollectionCreator } from '../lib/reducers/entity-collection-creator';
import { NxaEntityCollection } from '../lib/reducers/entity-collection';


const TEST_ACTION = 'test/get-everything-succeeded';
const EC_METAREDUCER_TOKEN = new InjectionToken<
    MetaReducer<NxaEntityCache, Action>
>('EC MetaReducer');

@Injectable()
class TestNxaEntityEffects {
    test$: Observable<Action> = createEffect(() =>
        this.actions.pipe(
            // tap(action => console.log('test$ effect', action)),
            ofNxaEntityOp(persistNxaOps),
            map(this.testHook)
        )
    );

    testHook(action: NxaEntityAction) {
        return {
            type: 'test-action',
            payload: action, // the incoming action
            entityName: action.payload.entityName,
        };
    }

    constructor(private actions: Actions<NxaEntityAction>) { }
}

class Hero {
    id!: number;
    name!: string;
    power?: string;
}

class Villain {
    id!: string;
    name!: string;
}

const entityMetadata = {
    Hero: {},
    Villain: {},
};

//////// Tests begin ////////

describe('EntityDataModule', () => {
    describe('with replaced NxaEntityEffects', () => {
        // factory never changes in these tests
        const nxaEntityActionFactory = new NxaEntityActionFactory();

        let actions$: Actions;
        let store: Store<NxaEntityCache>;
        let testEffects: TestNxaEntityEffects;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    StoreModule.forRoot({}),
                    EffectsModule.forRoot([]),
                    NxaEntityDataModule.forRoot({
                        entityMetadata: entityMetadata,
                    }),
                ],
                providers: [
                    { provide: NxaEntityCacheEffects, useValue: {} },
                    { provide: NxaEntityEffects, useClass: TestNxaEntityEffects },
                ],
            });

            actions$ = TestBed.get(Actions);
            store = TestBed.get(Store);

            testEffects = TestBed.get(NxaEntityEffects);
            spyOn(testEffects, 'testHook').and.callThrough();
        });

        it('should invoke test effect with an NxaEntityAction', () => {
            const actions: Action[] = [];

            // listen for actions after the next dispatched action
            actions$
                .pipe(
                    // tap(act => console.log('test action', act)),
                    skip(1) // Skip QUERY_ALL
                )
                .subscribe(act => actions.push(act));

            const action = nxaEntityActionFactory.create('Hero', NxaEntityOp.QUERY_ALL);
            store.dispatch(action);
            expect(actions.length).toBe(1, 'expect one effect action');
            expect(actions[0].type).toBe('test-action');
        });

        it('should not invoke test effect with non-NxaEntityAction', () => {
            const actions: Action[] = [];

            // listen for actions after the next dispatched action
            actions$.pipe(skip(1)).subscribe(act => actions.push(act));

            store.dispatch({ type: 'not-an-entity-action' });
            expect(actions.length).toBe(0);
        });
    });

    describe('with NxaEntityCacheMetaReducer', () => {
        let cacheSelector$: Observable<NxaEntityCache>;
        let eaFactory: NxaEntityActionFactory;
        let metaReducerLog: string[];
        let store: Store<{ entityCache: NxaEntityCache }>;

        function loggingNxaEntityCacheMetaReducer(
            reducer: ActionReducer<NxaEntityCache>
        ): ActionReducer<NxaEntityCache> {
            return (state, action) => {
                metaReducerLog.push(`MetaReducer saw "${action.type}"`);
                return reducer(state, action);
            };
        }

        beforeEach(() => {
            metaReducerLog = [];

            TestBed.configureTestingModule({
                imports: [
                    StoreModule.forRoot({}),
                    EffectsModule.forRoot([]),
                    NxaEntityDataModule.forRoot({
                        entityMetadata: entityMetadata,
                        entityCacheMetaReducers: [
                            loggingNxaEntityCacheMetaReducer,
                            EC_METAREDUCER_TOKEN,
                        ],
                    }),
                ],
                providers: [
                    { provide: NxaEntityCacheEffects, useValue: {} },
                    { provide: NxaEntityEffects, useValue: {} },
                    {
                        // Here's how you add an NxaEntityCache metareducer with an injected service
                        provide: EC_METAREDUCER_TOKEN,
                        useFactory: entityCacheMetaReducerFactory,
                        deps: [NxaEntityCollectionCreator],
                    },
                ],
            });

            store = TestBed.get(Store);
            cacheSelector$ = <any>store.select(state => state.entityCache);
            eaFactory = TestBed.get(NxaEntityActionFactory);
        });

        it('should log an ordinary entity action', () => {
            const action = eaFactory.create('Hero', NxaEntityOp.SET_LOADING);
            store.dispatch(action);
            expect(metaReducerLog.join('|')).toContain(
                NxaEntityOp.SET_LOADING,
                'logged entity action'
            );
        });

        it('should respond to action handled by custom NxaEntityCacheMetaReducer', () => {
            const data = {
                Hero: [
                    { id: 2, name: 'B', power: 'Fast' },
                    { id: 1, name: 'A', power: 'invisible' },
                ],
                Villain: [{ id: 30, name: 'Dr. Evil' }],
            };
            const action = {
                type: TEST_ACTION,
                payload: data,
            };
            store.dispatch(action);
            cacheSelector$.subscribe(cache => {
                try {
                    expect(cache.Hero.entities[1]).toEqual(
                        data.Hero[1],
                        'has expected hero'
                    );
                    expect(cache.Villain.entities[30]).toEqual(
                        data.Villain[0],
                        'has expected hero'
                    );
                    expect(metaReducerLog.join('|')).toContain(
                        TEST_ACTION,
                        'logged test action'
                    );
                } catch (error) {
                    fail(error);
                }
            }, fail);
        });
    });
});

// #region helpers

/** Create the test entityCacheMetaReducer, injected in tests */
function entityCacheMetaReducerFactory(
    collectionCreator: NxaEntityCollectionCreator
) {
    return (reducer: ActionReducer<NxaEntityCache, Action>) => {
        return (state: NxaEntityCache, action: { type: string; payload?: any }) => {
            switch (action.type) {
                case TEST_ACTION: {
                    const mergeState = {
                        Hero: createCollection<Hero>('Hero', action.payload['Hero'] || []),
                        Villain: createCollection<Villain>(
                            'Villain',
                            action.payload['Villain'] || []
                        ),
                    };
                    return { ...state, ...mergeState };
                }
            }
            return reducer(state, action);
        };
    };

    function createCollection<T extends { id: any }>(
        entityName: string,
        data: T[]
    ) {
        return {
            ...collectionCreator.create<T>(entityName),
            ids: data.map(e => e.id),
            entities: data.reduce(
                (acc, e) => {
                    acc[e.id] = e;
                    return acc;
                },
                {} as any
            ),
        } as NxaEntityCollection<T>;
    }
}
// #endregion