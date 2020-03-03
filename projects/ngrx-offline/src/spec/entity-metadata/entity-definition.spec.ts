import { NxaEntityMetadata } from "../../lib/entity-metadata/entity-metadata";
import { createNxaEntityDefinition } from '../../lib/entity-metadata/entity-definition';


interface Hero {
    id: number;
    name: string;
}

interface NonIdClass {
    key: string;
    something: any;
}

const sorter = <T>(a: T, b: T) => 'foo';

const filter = <T>(entities: T[], pattern?: any) => entities;

const selectIdForNonId = (entity: any) => entity.key;

const HERO_METADATA: NxaEntityMetadata<Hero> = {
    entityName: 'Hero',
    sortComparer: sorter,
    filterFn: filter,
};

describe('NxaEntityDefinition', () => {
    let heroMetadata: NxaEntityMetadata<Hero>;

    describe('#createNxaEntityDefinition', () => {
        beforeEach(() => {
            heroMetadata = { ...HERO_METADATA };
        });

        it('generates expected `initialState`', () => {
            const def = createNxaEntityDefinition(heroMetadata);
            const initialState = def.initialState;
            expect(initialState).toEqual({
                entityName: 'Hero',
                ids: [],
                entities: {},
                filter: '',
                loaded: false,
                loading: false,
                changeState: {},
            });
        });

        it('generates expected `initialState` when `additionalCollectionState`', () => {
            // extend Hero collection metadata with more collection state
            const metadata = {
                ...heroMetadata,
                additionalCollectionState: { foo: 'foo' },
            };
            const def = createNxaEntityDefinition(metadata);
            const initialState = def.initialState;
            expect(initialState).toEqual(<any>{
                entityName: 'Hero',
                ids: [],
                entities: {},
                filter: '',
                loaded: false,
                loading: false,
                changeState: {},
                foo: 'foo',
            });
        });

        it('creates default `selectId` on the definition when no metadata.selectId', () => {
            const def = createNxaEntityDefinition(heroMetadata);
            expect(def.selectId({ id: 42 } as Hero)).toBe(42);
        });

        it('creates expected `selectId` on the definition when  metadata.selectId exists', () => {
            const metadata: NxaEntityMetadata = {
                entityName: 'NonIdClass',
                selectId: selectIdForNonId,
            };
            const def = createNxaEntityDefinition(metadata);
            expect(def.selectId({ key: 'foo' })).toBe('foo');
        });

        it('sets `sortComparer` to false if not in metadata', () => {
            delete heroMetadata.sortComparer;
            const def = createNxaEntityDefinition(heroMetadata);
            expect(def.metadata.sortComparer).toBe(false);
        });

        it('sets `entityDispatchOptions to {} if not in metadata', () => {
            const def = createNxaEntityDefinition(heroMetadata);
            expect(def.entityDispatcherOptions).toEqual({});
        });

        it('passes `metadata.entityDispatchOptions` thru', () => {
            const options = {
                optimisticAdd: false,
                optimisticUpdate: false,
            };
            heroMetadata.entityDispatcherOptions = options;
            const def = createNxaEntityDefinition(heroMetadata);
            expect(def.entityDispatcherOptions).toBe(options);
        });

        it('throws error if missing `entityName`', () => {
            const metadata: NxaEntityMetadata = <any>{};
            expect(() => createNxaEntityDefinition(metadata)).toThrowError(/entityName/);
        });
    });
});