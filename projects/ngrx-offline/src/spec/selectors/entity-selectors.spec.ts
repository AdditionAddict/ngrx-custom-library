import { MemoizedSelector } from '@ngrx/store';
import { NxaEntityMetadata } from '../../lib/entity-metadata/entity-metadata';
import { NxaEntitySelectorsFactory, NxaEntitySelectors } from '../../lib/selectors/entity-selectors';
import { NxaEntityCollection } from '../../lib/reducers/entity-collection';
import { createEmptyNxaEntityCollection } from '../../lib/reducers/entity-collection-creator';
import { NxaPropsFilterFnFactory } from '../../lib/entity-metadata/entity-filters';


describe('NxaEntitySelectors', () => {
    /** HeroMetadata identifies the extra collection state properties */
    const heroMetadata: NxaEntityMetadata<Hero> = {
        entityName: 'Hero',
        filterFn: nameFilter,
        additionalCollectionState: {
            foo: 'Foo',
            bar: 3.14,
        },
    };

    const villainMetadata: NxaEntityMetadata<Villain> = {
        entityName: 'Villain',
        selectId: villain => villain.key,
    };

    let collectionCreator: any;
    let entitySelectorsFactory: NxaEntitySelectorsFactory;

    beforeEach(() => {
        collectionCreator = jasmine.createSpyObj('entityCollectionCreator', [
            'create',
        ]);
        entitySelectorsFactory = new NxaEntitySelectorsFactory(collectionCreator);
    });

    describe('#createCollectionSelector', () => {
        const initialState = createHeroState({
            ids: [1],
            entities: { 1: { id: 1, name: 'A' } },
            foo: 'foo foo',
            bar: 42,
        });

        it('creates collection selector that defaults to initial state', () => {
            collectionCreator.create.and.returnValue(initialState);
            const selectors = entitySelectorsFactory.createCollectionSelector<
                Hero,
                HeroCollection
            >('Hero');
            const state = { entityCache: {} }; // ngrx store with empty cache
            const collection = selectors(state);
            expect(collection.entities).toEqual(initialState.entities, 'entities');
            expect(collection.foo).toEqual('foo foo', 'foo');
            expect(collectionCreator.create).toHaveBeenCalled();
        });

        it('collection selector should return cached collection when it exists', () => {
            // must specify type-args when initialState isn't available for type inference
            const selectors = entitySelectorsFactory.createCollectionSelector<
                Hero,
                HeroCollection
            >('Hero');

            // ngrx store with populated Hero collection
            const state = {
                entityCache: {
                    Hero: {
                        ids: [42],
                        entities: { 42: { id: 42, name: 'The Answer' } },
                        filter: '',
                        loading: true,
                        foo: 'towel',
                        bar: 0,
                    },
                },
            };

            const collection = selectors(state);
            expect(collection.entities[42]).toEqual(
                { id: 42, name: 'The Answer' },
                'entities'
            );
            expect(collection.foo).toBe('towel', 'foo');
            expect(collectionCreator.create).not.toHaveBeenCalled();
        });
    });

    describe('#createNxaEntitySelectors', () => {
        let heroCollection: HeroCollection;
        let heroEntities: Hero[];

        beforeEach(() => {
            heroEntities = [{ id: 42, name: 'A' }, { id: 48, name: 'B' }];

            heroCollection = <HeroCollection>(<any>{
                ids: [42, 48],
                entities: {
                    42: heroEntities[0],
                    48: heroEntities[1],
                },
                filter: 'B',
                foo: 'Foo',
            });
        });

        it('should have expected Hero selectors (a super-set of NxaEntitySelectors)', () => {
            const store = { entityCache: { Hero: heroCollection } };

            const selectors = entitySelectorsFactory.create<Hero, HeroSelectors>(
                heroMetadata
            );

            expect(selectors.selectEntities).toBeDefined('selectEntities');
            expect(selectors.selectEntities(store)).toEqual(
                heroEntities,
                'selectEntities'
            );

            expect(selectors.selectFilteredEntities(store)).toEqual(
                heroEntities.filter(h => h.name === 'B'),
                'filtered B heroes'
            );

            expect(selectors.selectFoo).toBeDefined('selectFoo exists');
            expect(selectors.selectFoo(store)).toBe('Foo', 'execute `selectFoo`');
        });

        it('should have all Hero when create EntitySelectorFactory directly', () => {
            const store = { entityCache: { Hero: heroCollection } };

            // Create EntitySelectorFactory directly rather than injecting it!
            // Works ONLY if have not changed the name of the NxaEntityCache.
            // In this case, where also not supplying the NxaEntityCollectionCreator
            // selector for additional collection properties might fail,
            // but doesn't in this test because the additional Foo property is in the store.

            const eaFactory = new NxaEntitySelectorsFactory();
            const selectors = eaFactory.create<Hero, HeroSelectors>(heroMetadata);

            expect(selectors.selectEntities).toBeDefined('selectEntities');
            expect(selectors.selectEntities(store)).toEqual(
                heroEntities,
                'selectEntities'
            );

            expect(selectors.selectFilteredEntities(store)).toEqual(
                heroEntities.filter(h => h.name === 'B'),
                'filtered B heroes'
            );

            expect(selectors.selectFoo).toBeDefined('selectFoo exists');
            expect(selectors.selectFoo(store)).toBe('Foo', 'execute `selectFoo`');
        });

        it('should create default selectors (no filter, no extras) when create with "Hero" instead of hero metadata', () => {
            const store = { entityCache: { Hero: heroCollection } };

            // const selectors = entitySelectorsFactory.create<Hero, HeroSelectors>('Hero');
            // There won't be extra selectors so type selectors for Hero collection only
            const selectors = entitySelectorsFactory.create<Hero>('Hero');
            expect(selectors.selectEntities).toBeDefined('selectEntities');
            expect(selectors.selectFoo).not.toBeDefined('selectFoo should not exist');
            expect(selectors.selectFilteredEntities(store)).toEqual(
                heroEntities,
                'filtered same as all hero entities'
            );
        });

        it('should have expected Villain selectors', () => {
            const collection = <NxaEntityCollection<Villain>>(<any>{
                ids: [24],
                entities: { 24: { key: 'evil', name: 'A' } },
                filter: 'B', // doesn't matter because no filter function
            });
            const store = { entityCache: { Villain: collection } };

            const selectors = entitySelectorsFactory.create<Villain>(villainMetadata);
            const expectedEntities: Villain[] = [{ key: 'evil', name: 'A' }];

            expect(selectors.selectEntities).toBeDefined('selectAll');
            expect(selectors.selectEntities(store)).toEqual(
                expectedEntities,
                'try selectAll'
            );

            expect(selectors.selectFilteredEntities(store)).toEqual(
                expectedEntities,
                'all villains because no filter fn'
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

/// Villain
interface Villain {
    key: string;
    name: string;
}