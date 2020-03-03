import { Action, MemoizedSelector, Store } from '@ngrx/store';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { NxaEntityMetadata } from '../../lib/entity-metadata/entity-metadata';
import { NxaEntityCache } from '../../lib/reducers/entity-cache';
import { NxaEntitySelectors$Factory, NxaEntitySelectors$ } from '../../lib/selectors/entity-selectors$';
import { NxaEntitySelectorsFactory, NxaEntitySelectors } from '../../lib/selectors/entity-selectors';
import { createNxaEntityCacheSelector } from '../../lib/selectors/entity-cache-selector';
import { NXA_ENTITY_CACHE_NAME } from '../../lib/reducers/constants';
import { NxaEntityCollection } from '../../lib/reducers/entity-collection';
import { NxaEntityActionFactory } from '../../lib/actions/entity-action-factory';
import { NxaEntityOp } from '../../lib/actions/entity-op';
import { createEmptyNxaEntityCollection } from '../../lib/reducers/entity-collection-creator';
import { NxaPropsFilterFnFactory } from '../../lib/entity-metadata/entity-filters';


describe('NxaEntitySelectors$', () => {
    /** HeroMetadata identifies extra collection state properties */
    const heroMetadata: NxaEntityMetadata<Hero> = {
        entityName: 'Hero',
        filterFn: nameFilter,
        additionalCollectionState: {
            foo: 'Foo',
            bar: 3.14,
        },
    };

    /** As entityAdapter.initialState would create it */
    const emptyHeroCollection = createHeroState({ foo: 'foo', bar: 3.14 });

    const villainMetadata: NxaEntityMetadata<Villain> = {
        entityName: 'Villain',
        selectId: villain => villain.key,
    };

    // Hero has a super-set of NxaEntitySelectors$
    describe('NxaEntitySelectors$Factory.create (Hero)', () => {
        // Some immutable cache states
        const emptyCache: NxaEntityCache = {};

        const initializedHeroCache: NxaEntityCache = <any>{
            // The state of the HeroCollection in this test suite
            // as the EntityReducer might initialize it.
            Hero: emptyHeroCollection,
        };

        let collectionCreator: any;

        let bar: number;
        let collection: HeroCollection;
        let foo: string;
        let heroes: Hero[];
        let loaded: boolean;
        let loading: boolean;

        // The store during tests will be the entity cache
        let store: Store<{ entityCache: NxaEntityCache }>;

        // Observable of state changes, which these tests simulate
        let state$: BehaviorSubject<{ entityCache: NxaEntityCache }>;

        let actions$: Subject<Action>;

        const nextCacheState = (cache: NxaEntityCache) =>
            state$.next({ entityCache: cache });

        let heroNxaCollectionSelectors: HeroSelectors;

        let factory: NxaEntitySelectors$Factory;

        beforeEach(() => {
            actions$ = new Subject<Action>();
            state$ = new BehaviorSubject({ entityCache: emptyCache });
            store = new Store<{ entityCache: NxaEntityCache }>(
                state$,
                null as any,
                null as any
            );

            // NxaEntitySelectors
            collectionCreator = jasmine.createSpyObj('entityCollectionCreator', [
                'create',
            ]);
            collectionCreator.create.and.returnValue(emptyHeroCollection);
            const entitySelectorsFactory = new NxaEntitySelectorsFactory(
                collectionCreator
            );
            heroNxaCollectionSelectors = entitySelectorsFactory.create<
                Hero,
                HeroSelectors
            >(heroMetadata);

            // EntitySelectorFactory
            factory = new NxaEntitySelectors$Factory(
                store,
                actions$ as any,
                createNxaEntityCacheSelector(NXA_ENTITY_CACHE_NAME)
            );

            // listen for changes to the hero collection
            store
                .select<HeroCollection>(NXA_ENTITY_CACHE_NAME as any, 'Hero')
                .subscribe((c: HeroCollection) => (collection = c));
        });

        function subscribeToSelectors(selectors$: HeroSelectors$) {
            selectors$.entities$.subscribe(h => (heroes = h));
            selectors$.loaded$.subscribe(l => (loaded = l));
            selectors$.loading$.subscribe(l => (loading = l));
            selectors$.foo$.subscribe(f => (foo = f));
            selectors$.bar$.subscribe(b => (bar = b));
        }

        it('can select$ the default empty collection when store collection is undefined ', () => {
            const selectors$ = factory.create<Hero, HeroSelectors$>(
                'Hero',
                heroNxaCollectionSelectors
            );
            let selectorCollection: NxaEntityCollection<HeroCollection>;
            selectors$.collection$.subscribe(c => (selectorCollection = c));
            expect(selectorCollection!).toBeDefined('selector collection');
            expect(selectorCollection!.entities).toEqual({}, 'entities');

            // Important: the selector is returning these values;
            // They are not actually in the store's entity cache collection!
            expect(collection).toBeUndefined(
                'no collection until reducer creates it.'
            );
        });

        it('selectors$ emit default empty values when collection is undefined', () => {
            const selectors$ = factory.create<Hero, HeroSelectors$>(
                'Hero',
                heroNxaCollectionSelectors
            );

            subscribeToSelectors(selectors$);

            expect(heroes).toEqual([], 'no heroes by default');
            expect(loaded).toBe(false, 'loaded is false by default');
            expect(loading).toBe(false, 'loading is false by default');
            expect(foo).toBe('foo', 'default foo value is "foo"');
            expect(bar).toBe(3.14, 'no default bar value is 3.14');
        });

        it('selectors$ emit updated hero values', () => {
            const selectors$ = factory.create<Hero, HeroSelectors$>(
                'Hero',
                heroNxaCollectionSelectors
            );

            subscribeToSelectors(selectors$);

            // prime the store for Hero first use as the EntityReducer would
            nextCacheState(initializedHeroCache);

            // set foo and add an entity as the reducer would
            collection = {
                ...collection,
                ...{
                    foo: 'FooDoo',
                    ids: [42],
                    loaded: true,
                    entities: { 42: { id: 42, name: 'Bob' } },
                },
            };

            // update the store as a reducer would
            nextCacheState({ ...emptyCache, Hero: collection });

            // Selectors$ should have emitted the updated values.
            expect(heroes).toEqual([{ id: 42, name: 'Bob' }], 'added a hero');
            expect(loaded).toBe(true, 'loaded'); // as if had QueryAll
            expect(loading).toBe(false, 'loading'); // didn't change
            expect(foo).toEqual('FooDoo', 'updated foo value');
            expect(bar).toEqual(3.14, 'still the initial value'); // didn't change
        });

        it('selectors$ emit supplied defaultCollectionState when collection is undefined', () => {
            // N.B. This is an absurd default state, suitable for test purposes only.
            // The default state feature exists to prevent selectors$ subscriptions
            // from bombing before the collection is initialized or
            // during time-travel debugging.
            const defaultHeroState = createHeroState({
                ids: [1],
                entities: { 1: { id: 1, name: 'A' } },
                loaded: true,
                foo: 'foo foo',
                bar: 42,
            });

            collectionCreator.create.and.returnValue(defaultHeroState);
            const selectors$ = factory.create<Hero, HeroSelectors$>(
                'Hero',
                heroNxaCollectionSelectors
            ); // <- override default state

            subscribeToSelectors(selectors$);

            expect(heroes).toEqual([{ id: 1, name: 'A' }], 'default state heroes');
            expect(foo).toEqual('foo foo', 'has default foo');
            expect(bar).toEqual(42, 'has default bar');

            // Important: the selector is returning these values;
            // They are not actually in the store's entity cache collection!
            expect(collection).toBeUndefined(
                'no collection until reducer creates it.'
            );
        });

        it('`entityCache$` should observe the entire entity cache', () => {
            const entityCacheValues: any = [];
            factory.entityCache$.subscribe(ec => entityCacheValues.push(ec));

            // prime the store for Hero first use as the EntityReducer would
            nextCacheState(initializedHeroCache);

            expect(entityCacheValues.length).toEqual(2, 'set the cache twice');
            expect(entityCacheValues[0]).toEqual({}, 'empty at first');
            expect(entityCacheValues[1].Hero).toBeDefined('has Hero collection');
        });

        it('`actions$` emits hero collection NxaEntityActions and no other actions', () => {
            const actionsReceived: Action[] = [];
            const selectors$ = factory.create<Hero, HeroSelectors$>(
                'Hero',
                heroNxaCollectionSelectors
            );
            const NxaEntityActions$ = selectors$.NxaEntityActions$;
            NxaEntityActions$.subscribe(action => actionsReceived.push(action));

            const eaFactory = new NxaEntityActionFactory();
            actions$.next({ type: 'Generic action' });
            // NxaEntityAction but not for heroes
            actions$.next(eaFactory.create('Villain', NxaEntityOp.QUERY_ALL));
            // Hero NxaEntityAction
            const heroAction = eaFactory.create('Hero', NxaEntityOp.QUERY_ALL);
            actions$.next(heroAction);

            expect(actionsReceived.length).toBe(1, 'only one hero action');
            expect(actionsReceived[0]).toBe(heroAction, 'expected hero action');
        });

        it('`errors$` emits hero collection NxaEntityAction errors and no other actions', () => {
            const actionsReceived: Action[] = [];
            const selectors$ = factory.create<Hero, HeroSelectors$>(
                'Hero',
                heroNxaCollectionSelectors
            );
            const errors$ = selectors$.errors$;
            errors$.subscribe(action => actionsReceived.push(action));

            const eaFactory = new NxaEntityActionFactory();
            actions$.next({ type: 'Generic action' });
            // NxaEntityAction error but not for heroes
            actions$.next(eaFactory.create('Villain', NxaEntityOp.QUERY_ALL_ERROR));
            // Hero NxaEntityAction (but not an error)
            actions$.next(eaFactory.create('Hero', NxaEntityOp.QUERY_ALL));
            // Hero NxaEntityAction Error
            const heroErrorAction = eaFactory.create(
                'Hero',
                NxaEntityOp.QUERY_ALL_ERROR
            );
            actions$.next(heroErrorAction);
            expect(actionsReceived.length).toBe(1, 'only one hero action');
            expect(actionsReceived[0]).toBe(
                heroErrorAction,
                'expected error hero action'
            );
        });
    });
});

/////// Test values and helpers /////////

function createHeroState(state: Partial<HeroCollection>): HeroCollection {
    return {
        ...createEmptyNxaEntityCollection<Hero>('Hero'),
        ...state,
    } as HeroCollection;
}

function nameFilter<T>(entities: T[], pattern: string) {
    return NxaPropsFilterFnFactory<any>(['name'])(entities, pattern);
}

/// Hero
interface Hero {
    id: number;
    name: string;
}

/** HeroCollection is EntityCollection<Hero> with extra collection properties */
interface HeroCollection extends NxaEntityCollection<Hero> {
    foo: string;
    bar: number;
}

/** HeroSelectors identifies the extra selectors for the extra collection properties */
interface HeroSelectors extends NxaEntitySelectors<Hero> {
    selectFoo: MemoizedSelector<Object, string>;
    selectBar: MemoizedSelector<Object, number>;
}

/** HeroSelectors identifies the extra selectors for the extra collection properties */
interface HeroSelectors$ extends NxaEntitySelectors$<Hero> {
    foo$: Observable<string> | Store<string>;
    bar$: Observable<number> | Store<number>;
}

/// Villain
interface Villain {
    key: string;
    name: string;
}