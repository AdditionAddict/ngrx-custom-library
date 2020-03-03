import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Subject } from 'rxjs';

import { NxaEntityActionFactory } from '../../lib/actions/entity-action-factory';
import { NxaEntityOp } from '../../lib/actions/entity-op';
import { defaultSelectId } from '../../lib/utils/utilities';
import { NxaMergeStrategy } from '../../lib/actions/merge-strategy';
import { NxaEntityAction } from '../../lib/actions/entity-action';
import { NxaEntityDispatcherDefaultOptions } from '../../lib/dispatchers/entity-dispatcher-default-options';
import { NxaEntityDispatcher } from '../../lib/dispatchers/entity-dispatcher';
import { CorrelationIdGenerator } from '../../lib/utils/correlation-id-generator';
import { createNxaEntityCacheSelector } from '../../lib/selectors/entity-cache-selector';
import { NxaEntityDispatcherBase } from '../../lib/dispatchers/entity-dispatcher-base';

class Hero {
    id!: number;
    name!: string;
    saying?: string;
}

/** Store stub */
class TestStore {
    // only interested in calls to store.dispatch()
    dispatch() { }
    select() { }
}

const defaultDispatcherOptions = new NxaEntityDispatcherDefaultOptions();

describe('NxaEntityDispatcher', () => {
    commandDispatchTest(entityDispatcherSetup);

    function entityDispatcherSetup() {
        const correlationIdGenerator = new CorrelationIdGenerator();
        const nxaEntityActionFactory = new NxaEntityActionFactory();
        const entityCacheSelector = createNxaEntityCacheSelector();
        const scannedActions$ = new Subject<Action>();
        const selectId = defaultSelectId;
        const store: any = new TestStore();

        const dispatcher = new NxaEntityDispatcherBase<Hero>(
            'Hero',
            nxaEntityActionFactory,
            store,
            selectId,
            defaultDispatcherOptions,
            scannedActions$, // scannedActions$ not used in these tests
            entityCacheSelector, // entityCacheSelector not used in these tests
            correlationIdGenerator
        );
        return { dispatcher, store };
    }
});

///// Tests /////

/**
 * Test that implementer of NxaEntityCommands dispatches properly
 * @param setup Function that sets up the NxaEntityDispatcher before each test (called in a BeforeEach()).
 */
export function commandDispatchTest(
    setup: () => { dispatcher: NxaEntityDispatcher<Hero>; store: any }
) {
    let dispatcher: NxaEntityDispatcher<Hero>;
    let testStore: { dispatch: jasmine.Spy };

    function dispatchedAction() {
        return <NxaEntityAction>testStore.dispatch.calls.argsFor(0)[0];
    }

    beforeEach(() => {
        const s = setup();
        spyOn(s.store, 'dispatch').and.callThrough();
        dispatcher = s.dispatcher;
        testStore = s.store;
    });

    it('#entityName is the expected name of the entity type', () => {
        expect(dispatcher.entityName).toBe('Hero');
    });

    it('#cancel(correlationId) can dispatch CANCEL_PERSIST', () => {
        dispatcher.cancel('CRID007', 'Test cancel');
        const { entityOp, correlationId, data } = dispatchedAction().payload;
        expect(entityOp).toBe(NxaEntityOp.CANCEL_PERSIST);
        expect(correlationId).toBe('CRID007');
        expect(data).toBe('Test cancel');
    });

    describe('Save actions', () => {
        // By default add and update are pessimistic and delete is optimistic.
        // Tests override in the dispatcher method calls as necessary.

        describe('(optimistic)', () => {
            it('#add(hero) can dispatch SAVE_ADD_ONE optimistically', () => {
                const hero: Hero = { id: 42, name: 'test' };
                dispatcher.add(hero, { isOptimistic: true });
                const { entityOp, isOptimistic, data } = dispatchedAction().payload;
                expect(entityOp).toBe(NxaEntityOp.SAVE_ADD_ONE);
                expect(isOptimistic).toBe(true);
                expect(data).toBe(hero);
            });

            it('#delete(42) dispatches SAVE_DELETE_ONE optimistically for the id:42', () => {
                dispatcher.delete(42); // optimistic by default
                const { entityOp, isOptimistic, data } = dispatchedAction().payload;
                expect(entityOp).toBe(NxaEntityOp.SAVE_DELETE_ONE);
                expect(isOptimistic).toBe(true);
                expect(data).toBe(42);
            });

            it('#delete(hero) dispatches SAVE_DELETE_ONE optimistically for the hero.id', () => {
                const id = 42;
                const hero: Hero = { id, name: 'test' };
                dispatcher.delete(hero); // optimistic by default
                const { entityOp, isOptimistic, data } = dispatchedAction().payload;
                expect(entityOp).toBe(NxaEntityOp.SAVE_DELETE_ONE);
                expect(isOptimistic).toBe(true);
                expect(data).toBe(42);
            });

            it('#update(hero) can dispatch SAVE_UPDATE_ONE optimistically with an update payload', () => {
                const hero: Hero = { id: 42, name: 'test' };
                const expectedUpdate: Update<Hero> = { id: 42, changes: hero };

                dispatcher.update(hero, { isOptimistic: true });
                const { entityOp, isOptimistic, data } = dispatchedAction().payload;
                expect(entityOp).toBe(NxaEntityOp.SAVE_UPDATE_ONE);
                expect(isOptimistic).toBe(true);
                expect(data).toEqual(expectedUpdate);
            });
        });

        describe('(pessimistic)', () => {
            it('#add(hero) dispatches SAVE_ADD pessimistically', () => {
                const hero: Hero = { id: 42, name: 'test' };
                dispatcher.add(hero); // pessimistic by default
                const { entityOp, isOptimistic, data } = dispatchedAction().payload;
                expect(entityOp).toBe(NxaEntityOp.SAVE_ADD_ONE);
                expect(isOptimistic).toBe(false);
                expect(data).toBe(hero);
            });

            it('#delete(42) can dispatch SAVE_DELETE pessimistically for the id:42', () => {
                dispatcher.delete(42, { isOptimistic: false }); // optimistic by default
                const { entityOp, isOptimistic, data } = dispatchedAction().payload;
                expect(entityOp).toBe(NxaEntityOp.SAVE_DELETE_ONE);
                expect(isOptimistic).toBe(false);
                expect(data).toBe(42);
            });

            it('#delete(hero) can dispatch SAVE_DELETE pessimistically for the hero.id', () => {
                const id = 42;
                const hero: Hero = { id, name: 'test' };

                dispatcher.delete(hero, { isOptimistic: false }); // optimistic by default
                const { entityOp, isOptimistic, data } = dispatchedAction().payload;
                expect(entityOp).toBe(NxaEntityOp.SAVE_DELETE_ONE);
                expect(isOptimistic).toBe(false);
                expect(data).toBe(42);
            });

            it('#update(hero) dispatches SAVE_UPDATE with an update payload', () => {
                const hero: Hero = { id: 42, name: 'test' };
                const expectedUpdate: Update<Hero> = { id: 42, changes: hero };

                dispatcher.update(hero); // pessimistic by default
                const { entityOp, isOptimistic, data } = dispatchedAction().payload;
                expect(entityOp).toBe(NxaEntityOp.SAVE_UPDATE_ONE);
                expect(isOptimistic).toBe(false);
                expect(data).toEqual(expectedUpdate);
            });
        });
    });

    describe('Query actions', () => {
        it('#getAll() dispatches QUERY_ALL', () => {
            dispatcher.getAll();

            const {
                entityOp,
                entityName,
                mergeStrategy,
            } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.QUERY_ALL);
            expect(entityName).toBe('Hero');
            expect(mergeStrategy).toBeUndefined('no NxaMergeStrategy');
        });

        it('#getAll({mergeStrategy}) dispatches QUERY_ALL with a NxaMergeStrategy', () => {
            dispatcher.getAll({ mergeStrategy: NxaMergeStrategy.PreserveChanges });

            const {
                entityOp,
                entityName,
                mergeStrategy,
            } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.QUERY_ALL);
            expect(entityName).toBe('Hero');
            expect(mergeStrategy).toBe(NxaMergeStrategy.PreserveChanges);
        });

        it('#getByKey(42) dispatches QUERY_BY_KEY for the id:42', () => {
            dispatcher.getByKey(42);

            const { entityOp, data, mergeStrategy } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.QUERY_BY_KEY);
            expect(data).toBe(42);
            expect(mergeStrategy).toBeUndefined('no NxaMergeStrategy');
        });

        it('#getByKey(42, {mergeStrategy}) dispatches QUERY_BY_KEY with a NxaMergeStrategy', () => {
            dispatcher.getByKey(42, {
                mergeStrategy: NxaMergeStrategy.OverwriteChanges,
            });

            const { entityOp, data, mergeStrategy } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.QUERY_BY_KEY);
            expect(data).toBe(42);
            expect(mergeStrategy).toBe(NxaMergeStrategy.OverwriteChanges);
        });

        it('#getWithQuery(NxaQueryParams) dispatches QUERY_MANY', () => {
            dispatcher.getWithQuery({ name: 'B' });

            const {
                entityOp,
                data,
                entityName,
                mergeStrategy,
            } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.QUERY_MANY);
            expect(entityName).toBe('Hero');
            expect(data).toEqual({ name: 'B' }, 'params');
            expect(mergeStrategy).toBeUndefined('no NxaMergeStrategy');
        });

        it('#getWithQuery(string) dispatches QUERY_MANY', () => {
            dispatcher.getWithQuery('name=B');

            const {
                entityOp,
                data,
                entityName,
                mergeStrategy,
            } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.QUERY_MANY);
            expect(entityName).toBe('Hero');
            expect(data).toEqual('name=B', 'params');
            expect(mergeStrategy).toBeUndefined('no NxaMergeStrategy');
        });

        it('#getWithQuery(string) dispatches QUERY_MANY with a NxaMergeStrategy', () => {
            dispatcher.getWithQuery('name=B', {
                mergeStrategy: NxaMergeStrategy.PreserveChanges,
            });

            const {
                entityOp,
                data,
                entityName,
                mergeStrategy,
            } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.QUERY_MANY);
            expect(entityName).toBe('Hero');
            expect(data).toEqual('name=B', 'params');
            expect(mergeStrategy).toBe(NxaMergeStrategy.PreserveChanges);
        });

        it('#load() dispatches QUERY_LOAD', () => {
            dispatcher.load();

            const {
                entityOp,
                entityName,
                mergeStrategy,
            } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.QUERY_LOAD);
            expect(entityName).toBe('Hero');
            expect(mergeStrategy).toBeUndefined('no NxaMergeStrategy');
        });
    });

    /*** Cache-only operations ***/
    describe('Cache-only actions', () => {
        it('#addAllToCache dispatches ADD_ALL', () => {
            const heroes: Hero[] = [
                { id: 42, name: 'test 42' },
                { id: 84, name: 'test 84', saying: 'howdy' },
            ];
            dispatcher.addAllToCache(heroes);
            const { entityOp, data } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.ADD_ALL);
            expect(data).toBe(heroes);
        });

        it('#addOneToCache dispatches ADD_ONE', () => {
            const hero: Hero = { id: 42, name: 'test' };
            dispatcher.addOneToCache(hero);
            const { entityOp, data, mergeStrategy } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.ADD_ONE);
            expect(data).toBe(hero);
            expect(mergeStrategy).toBeUndefined('no NxaMergeStrategy');
        });

        it('#addOneToCache can dispatch ADD_ONE and NxaMergeStrategy.IgnoreChanges', () => {
            const hero: Hero = { id: 42, name: 'test' };
            dispatcher.addOneToCache(hero, {
                mergeStrategy: NxaMergeStrategy.IgnoreChanges,
            });
            const { entityOp, mergeStrategy } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.ADD_ONE);
            expect(mergeStrategy).toBe(NxaMergeStrategy.IgnoreChanges);
        });

        it('#addManyToCache dispatches ADD_MANY', () => {
            const heroes: Hero[] = [
                { id: 42, name: 'test 42' },
                { id: 84, name: 'test 84', saying: 'howdy' },
            ];
            dispatcher.addManyToCache(heroes);
            const { entityOp, data } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.ADD_MANY);
            expect(data).toBe(heroes);
        });

        it('#addManyToCache can dispatch ADD_MANY and NxaMergeStrategy.IgnoreChanges', () => {
            const heroes: Hero[] = [
                { id: 42, name: 'test 42' },
                { id: 84, name: 'test 84', saying: 'howdy' },
            ];
            dispatcher.addManyToCache(heroes, {
                mergeStrategy: NxaMergeStrategy.IgnoreChanges,
            });
            const { entityOp, mergeStrategy } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.ADD_MANY);
            expect(mergeStrategy).toBe(NxaMergeStrategy.IgnoreChanges);
        });

        it('#clearCache() dispatches REMOVE_ALL for the Hero collection', () => {
            dispatcher.clearCache();
            const { entityOp, entityName } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.REMOVE_ALL);
            expect(entityName).toBe('Hero');
        });

        it('#clearCache() can dispatch REMOVE_ALL with options', () => {
            dispatcher.clearCache({ mergeStrategy: NxaMergeStrategy.IgnoreChanges });
            const { entityOp, mergeStrategy } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.REMOVE_ALL);
            expect(mergeStrategy).toBe(NxaMergeStrategy.IgnoreChanges);
        });

        it('#removeOneFromCache(key) dispatches REMOVE_ONE', () => {
            const id = 42;
            dispatcher.removeOneFromCache(id);
            const { entityOp, data } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.REMOVE_ONE);
            expect(data).toBe(id);
        });

        it('#removeOneFromCache(key) can dispatch REMOVE_ONE and NxaMergeStrategy.IgnoreChanges', () => {
            const id = 42;
            dispatcher.removeOneFromCache(id, {
                mergeStrategy: NxaMergeStrategy.IgnoreChanges,
            });
            const { entityOp, mergeStrategy } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.REMOVE_ONE);
            expect(mergeStrategy).toBe(NxaMergeStrategy.IgnoreChanges);
        });

        it('#removeManyFromCache(keys) dispatches REMOVE_MANY', () => {
            const keys = [42, 84];
            dispatcher.removeManyFromCache(keys);
            const { entityOp, data } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.REMOVE_MANY);
            expect(data).toBe(keys);
        });

        it('#removeManyFromCache(keys) can dispatch REMOVE_MANY and NxaMergeStrategy.IgnoreChanges', () => {
            const keys = [42, 84];
            dispatcher.removeManyFromCache(keys, {
                mergeStrategy: NxaMergeStrategy.IgnoreChanges,
            });
            const { entityOp, mergeStrategy } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.REMOVE_MANY);
            expect(mergeStrategy).toBe(NxaMergeStrategy.IgnoreChanges);
        });

        it('#removeManyFromCache(entities) dispatches REMOVE_MANY', () => {
            const heroes: Hero[] = [
                { id: 42, name: 'test 42' },
                { id: 84, name: 'test 84', saying: 'howdy' },
            ];
            const keys = heroes.map(h => h.id);
            dispatcher.removeManyFromCache(heroes);
            const { entityOp, data } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.REMOVE_MANY);
            expect(data).toEqual(keys);
        });

        it('#toUpdate() helper method creates Update<T>', () => {
            const hero: Partial<Hero> = { id: 42, name: 'test' };
            const expected = { id: 42, changes: hero };
            const update = dispatcher.toUpdate(hero);
            expect(update).toEqual(expected);
        });

        it('#updateOneInCache dispatches UPDATE_ONE', () => {
            const hero: Partial<Hero> = { id: 42, name: 'test' };
            const update = { id: 42, changes: hero };
            dispatcher.updateOneInCache(hero);
            const { entityOp, data } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.UPDATE_ONE);
            expect(data).toEqual(update);
        });

        it('#updateOneInCache can dispatch UPDATE_ONE and NxaMergeStrategy.IgnoreChanges', () => {
            const hero: Partial<Hero> = { id: 42, name: 'test' };
            const update = { id: 42, changes: hero };
            dispatcher.updateOneInCache(hero, {
                mergeStrategy: NxaMergeStrategy.IgnoreChanges,
            });
            const { entityOp, mergeStrategy } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.UPDATE_ONE);
            expect(mergeStrategy).toBe(NxaMergeStrategy.IgnoreChanges);
        });

        it('#updateManyInCache dispatches UPDATE_MANY', () => {
            const heroes: Partial<Hero>[] = [
                { id: 42, name: 'test 42' },
                { id: 84, saying: 'ho ho ho' },
            ];
            const updates = [
                { id: 42, changes: heroes[0] },
                { id: 84, changes: heroes[1] },
            ];
            dispatcher.updateManyInCache(heroes);
            const { entityOp, data } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.UPDATE_MANY);
            expect(data).toEqual(updates);
        });

        it('#updateManyInCache can dispatch UPDATE_MANY and NxaMergeStrategy.IgnoreChanges', () => {
            const heroes: Partial<Hero>[] = [
                { id: 42, name: 'test 42' },
                { id: 84, saying: 'ho ho ho' },
            ];
            const updates = [
                { id: 42, changes: heroes[0] },
                { id: 84, changes: heroes[1] },
            ];
            dispatcher.updateManyInCache(heroes, {
                mergeStrategy: NxaMergeStrategy.IgnoreChanges,
            });
            const { entityOp, mergeStrategy } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.UPDATE_MANY);
            expect(mergeStrategy).toBe(NxaMergeStrategy.IgnoreChanges);
        });

        it('#upsertOneInCache dispatches UPSERT_ONE', () => {
            const hero = { id: 42, name: 'test' };
            dispatcher.upsertOneInCache(hero);
            const { entityOp, data } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.UPSERT_ONE);
            expect(data).toEqual(hero);
        });

        it('#upsertOneInCache can dispatch UPSERT_ONE and NxaMergeStrategy.IgnoreChanges', () => {
            const hero = { id: 42, name: 'test' };
            dispatcher.upsertOneInCache(hero, {
                mergeStrategy: NxaMergeStrategy.IgnoreChanges,
            });
            const { entityOp, mergeStrategy } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.UPSERT_ONE);
            expect(mergeStrategy).toBe(NxaMergeStrategy.IgnoreChanges);
        });

        it('#upsertManyInCache dispatches UPSERT_MANY', () => {
            const heroes = [
                { id: 42, name: 'test 42' },
                { id: 84, saying: 'ho ho ho' },
            ];
            dispatcher.upsertManyInCache(heroes);
            const { entityOp, data } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.UPSERT_MANY);
            expect(data).toEqual(heroes);
        });

        it('#upsertManyInCache can dispatch UPSERT_MANY and NxaMergeStrategy.IgnoreChanges', () => {
            const heroes = [
                { id: 42, name: 'test 42' },
                { id: 84, saying: 'ho ho ho' },
            ];
            dispatcher.upsertManyInCache(heroes, {
                mergeStrategy: NxaMergeStrategy.IgnoreChanges,
            });
            const { entityOp, mergeStrategy } = dispatchedAction().payload;
            expect(entityOp).toBe(NxaEntityOp.UPSERT_MANY);
            expect(mergeStrategy).toBe(NxaMergeStrategy.IgnoreChanges);
        });
    });
}