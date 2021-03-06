import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { NxaEntityCollection, NxaChangeType, NxaChangeState } from '../../lib/reducers/entity-collection';
import { createEmptyNxaEntityCollection } from '../../lib/reducers/entity-collection-creator';
import { NxaEntityChangeTracker } from '../../lib/reducers/entity-change-tracker';
import { NxaEntityChangeTrackerBase } from '../../lib/reducers/entity-change-tracker-base';
import { defaultSelectId } from '../../lib/utils/utilities';
import { NxaMergeStrategy } from '../../lib/actions/merge-strategy';

interface Hero {
    id: number;
    name: string;
    power?: string;
}

function sortByName(a: { name: string }, b: { name: string }): number {
    return a.name.localeCompare(b.name);
}

/** Test version of toUpdate that assumes entity has key named 'id' */
function toUpdate(entity: any) {
    return { id: entity.id, changes: entity };
}

const adapter: EntityAdapter<Hero> = createEntityAdapter<Hero>({
    sortComparer: sortByName,
});

describe('NxaEntityChangeTrackerBase', () => {
    let origCollection: NxaEntityCollection<Hero>;
    let tracker: NxaEntityChangeTracker<Hero>;

    beforeEach(() => {
        origCollection = createEmptyNxaEntityCollection<Hero>('Hero');
        origCollection.entities = {
            1: { id: 1, name: 'Alice', power: 'Strong' },
            2: { id: 2, name: 'Gail', power: 'Loud' },
            7: { id: 7, name: 'Bob', power: 'Swift' },
        };
        origCollection.ids = [1, 7, 2];
        tracker = new NxaEntityChangeTrackerBase(adapter, defaultSelectId);
    });

    describe('#commitAll', () => {
        it('should clear all tracked changes', () => {
            let { collection } = createTestTrackedEntities();
            expect(Object.keys(collection.changeState).length).toBe(
                3,
                'tracking 3 entities'
            );

            collection = tracker.commitAll(collection);
            expect(Object.keys(collection.changeState).length).toBe(
                0,
                'tracking zero entities'
            );
        });
    });

    describe('#commitOne', () => {
        it('should clear current tracking of the given entity', () => {
            // tslint:disable-next-line:prefer-const
            let {
                collection,
                deletedEntity,
                addedEntity,
                updatedEntity,
            } = createTestTrackedEntities();
            collection = tracker.commitMany([updatedEntity], collection);
            expect(collection.changeState[updatedEntity.id]).toBeUndefined(
                'no changes tracked for updated entity'
            );
            expect(collection.changeState[deletedEntity!.id]).toBeDefined(
                'still tracking deleted entity'
            );
            expect(collection.changeState[addedEntity.id]).toBeDefined(
                'still tracking added entity'
            );
        });
    });

    describe('#commitMany', () => {
        it('should clear current tracking of the given entities', () => {
            // tslint:disable-next-line:prefer-const
            let {
                collection,
                deletedEntity,
                addedEntity,
                updatedEntity,
            } = createTestTrackedEntities();
            collection = tracker.commitMany([addedEntity, updatedEntity], collection);
            expect(collection.changeState[addedEntity.id]).toBeUndefined(
                'no changes tracked for added entity'
            );
            expect(collection.changeState[updatedEntity.id]).toBeUndefined(
                'no changes tracked for updated entity'
            );
            expect(collection.changeState[deletedEntity!.id]).toBeDefined(
                'still tracking deleted entity'
            );
        });
    });

    describe('#mergeQueryResults', () => {
        it('should use default preserve changes strategy', () => {
            let {
                unchangedHero,
                unchangedHeroServerUpdated,
                updatedHero,
                serverUpdatedHero,
                locallyUpdatedHero,
                initialCache,
            } = createInitialCacheForMerges();
            const collection = tracker.mergeQueryResults(
                [unchangedHeroServerUpdated, serverUpdatedHero],
                initialCache.Hero
            );

            expect(collection.entities[unchangedHero.id]).toEqual(
                unchangedHeroServerUpdated,
                'Replace the current collection entity for unchanged entity'
            );
            expect(collection.entities[updatedHero.id]).toEqual(
                locallyUpdatedHero,
                'Preserves the current value for changed entity'
            );
            expect(collection.changeState[updatedHero.id]!.originalValue).toEqual(
                serverUpdatedHero,
                'Overwrites the originalValue with the merge entity'
            );
        });

        it('should be able to use ignore changes strategy', () => {
            const {
                updatedHero,
                serverUpdatedHero,
                initialCache,
            } = createInitialCacheForMerges();

            const collection = tracker.mergeQueryResults(
                [serverUpdatedHero],
                initialCache.Hero,
                NxaMergeStrategy.IgnoreChanges // manually provide strategy
            );

            expect(collection.entities[updatedHero.id]).toEqual(
                serverUpdatedHero,
                'Update the collection entity'
            );
            expect(collection.changeState[updatedHero.id]!.originalValue).toEqual(
                updatedHero,
                'changeState is untouched'
            );
        });

        it('should be able to use preserve changes strategy', () => {
            const {
                unchangedHero,
                unchangedHeroServerUpdated,
                updatedHero,
                serverUpdatedHero,
                locallyUpdatedHero,
                initialCache,
            } = createInitialCacheForMerges();

            const collection = tracker.mergeQueryResults(
                [unchangedHeroServerUpdated, serverUpdatedHero],
                initialCache.Hero,
                NxaMergeStrategy.PreserveChanges // manually provide strategy
            );

            expect(collection.entities[unchangedHero.id]).toEqual(
                unchangedHeroServerUpdated,
                'Replace the current collection entity for unchanged entity'
            );
            expect(collection.entities[updatedHero.id]).toEqual(
                locallyUpdatedHero,
                'Preserves the current value for changed entity'
            );
            expect(collection.changeState[updatedHero.id]!.originalValue).toEqual(
                serverUpdatedHero,
                'Overwrites the originalValue with the merge entity'
            );
        });

        it('should be able to use overwrite changes strategy', () => {
            const {
                unchangedHero,
                unchangedHeroServerUpdated,
                updatedHero,
                serverUpdatedHero,
                initialCache,
            } = createInitialCacheForMerges();

            const collection = tracker.mergeQueryResults(
                [unchangedHeroServerUpdated, serverUpdatedHero],
                initialCache.Hero,
                NxaMergeStrategy.OverwriteChanges // manually provide strategy
            );

            expect(collection.entities[unchangedHero.id]).toEqual(
                unchangedHeroServerUpdated,
                'Replace the current collection entity for unchanged entity'
            );
            expect(collection.changeState[unchangedHero.id]).toBeUndefined(
                'Discards the changeState (changeType unchanged) for unchanged entity'
            );
            expect(collection.entities[updatedHero.id]).toEqual(
                serverUpdatedHero,
                'Replace the current collection entity for changed entity'
            );
            expect(collection.changeState[updatedHero.id]).toBeUndefined(
                'Discards the changeState (changeType unchanged) for changed entity'
            );
        });
    });

    describe('#mergeSaveAdds', () => {
        it('should use default overwrite changes strategy', () => {
            let {
                unchangedHero,
                unchangedHeroServerUpdated,
                updatedHero,
                serverUpdatedHero,
                initialCache,
            } = createInitialCacheForMerges();
            const collection = tracker.mergeSaveAdds(
                [unchangedHeroServerUpdated, serverUpdatedHero],
                initialCache.Hero
            );

            expect(collection.entities[unchangedHero.id]).toEqual(
                unchangedHeroServerUpdated,
                'Replace the current collection entity for unchanged entity'
            );
            expect(collection.changeState[unchangedHero.id]).toBeUndefined(
                'Discards the changeState (changeType unchanged) for unchanged entity'
            );
            expect(collection.entities[updatedHero.id]).toEqual(
                serverUpdatedHero,
                'Replace the current collection entity for changed entity'
            );
            expect(collection.changeState[updatedHero.id]).toBeUndefined(
                'Discards the changeState (changeType unchanged) for changed entity'
            );
        });

        it('should be able to use ignore changes strategy', () => {
            const {
                updatedHero,
                serverUpdatedHero,
                initialCache,
            } = createInitialCacheForMerges();

            const collection = tracker.mergeSaveAdds(
                [serverUpdatedHero],
                initialCache.Hero,
                NxaMergeStrategy.IgnoreChanges // manually provide strategy
            );

            expect(collection.entities[updatedHero.id]).toEqual(
                serverUpdatedHero,
                'Update the collection entity'
            );
            expect(collection.changeState[updatedHero.id]!.originalValue).toEqual(
                updatedHero,
                'changeState is untouched'
            );
        });

        it('should be able to use preserve changes strategy', () => {
            const {
                unchangedHero,
                unchangedHeroServerUpdated,
                updatedHero,
                serverUpdatedHero,
                locallyUpdatedHero,
                initialCache,
            } = createInitialCacheForMerges();

            const collection = tracker.mergeSaveAdds(
                [unchangedHeroServerUpdated, serverUpdatedHero],
                initialCache.Hero,
                NxaMergeStrategy.PreserveChanges // manually provide strategy
            );

            expect(collection.entities[unchangedHero.id]).toEqual(
                unchangedHeroServerUpdated,
                'Replace the current collection entity for unchanged entity'
            );
            expect(collection.entities[updatedHero.id]).toEqual(
                locallyUpdatedHero,
                'Preserves the current value for changed entity'
            );
            expect(collection.changeState[updatedHero.id]!.originalValue).toEqual(
                serverUpdatedHero,
                'Overwrites the originalValue with the merge entity'
            );
        });

        it('should be able to use overwrite changes strategy', () => {
            const {
                unchangedHero,
                unchangedHeroServerUpdated,
                updatedHero,
                serverUpdatedHero,
                initialCache,
            } = createInitialCacheForMerges();

            const collection = tracker.mergeSaveAdds(
                [unchangedHeroServerUpdated, serverUpdatedHero],
                initialCache.Hero,
                NxaMergeStrategy.OverwriteChanges // manually provide strategy
            );

            expect(collection.entities[unchangedHero.id]).toEqual(
                unchangedHeroServerUpdated,
                'Replace the current collection entity for unchanged entity'
            );
            expect(collection.changeState[unchangedHero.id]).toBeUndefined(
                'Discards the changeState (changeType unchanged) for unchanged entity'
            );
            expect(collection.entities[updatedHero.id]).toEqual(
                serverUpdatedHero,
                'Replace the current collection entity for changed entity'
            );
            expect(collection.changeState[updatedHero.id]).toBeUndefined(
                'Discards the changeState (changeType unchanged) for changed entity'
            );
        });
    });

    describe('#mergeSaveDeletes', () => {
        // TODO: add some tests
    });

    describe('#mergeSaveUpdates', () => {
        // TODO: add some tests
    });

    describe('#mergeSaveUpserts', () => {
        it('should use default overwrite changes strategy', () => {
            let {
                unchangedHero,
                unchangedHeroServerUpdated,
                updatedHero,
                serverUpdatedHero,
                initialCache,
            } = createInitialCacheForMerges();
            const collection = tracker.mergeSaveUpserts(
                [unchangedHeroServerUpdated, serverUpdatedHero],
                initialCache.Hero
            );

            expect(collection.entities[unchangedHero.id]).toEqual(
                unchangedHeroServerUpdated,
                'Replace the current collection entity for unchanged entity'
            );
            expect(collection.changeState[unchangedHero.id]).toBeUndefined(
                'Discards the changeState (changeType unchanged) for unchanged entity'
            );
            expect(collection.entities[updatedHero.id]).toEqual(
                serverUpdatedHero,
                'Replace the current collection entity for changed entity'
            );
            expect(collection.changeState[updatedHero.id]).toBeUndefined(
                'Discards the changeState (changeType unchanged) for changed entity'
            );
        });

        it('should be able to use ignore changes strategy', () => {
            const {
                updatedHero,
                serverUpdatedHero,
                initialCache,
            } = createInitialCacheForMerges();

            const collection = tracker.mergeSaveUpserts(
                [serverUpdatedHero],
                initialCache.Hero,
                NxaMergeStrategy.IgnoreChanges // manually provide strategy
            );

            expect(collection.entities[updatedHero.id]).toEqual(
                serverUpdatedHero,
                'Update the collection entity'
            );
            expect(collection.changeState[updatedHero.id]!.originalValue).toEqual(
                updatedHero,
                'changeState is untouched'
            );
        });

        it('should be able to use preserve changes strategy', () => {
            const {
                unchangedHero,
                unchangedHeroServerUpdated,
                updatedHero,
                serverUpdatedHero,
                locallyUpdatedHero,
                initialCache,
            } = createInitialCacheForMerges();

            const collection = tracker.mergeSaveUpserts(
                [unchangedHeroServerUpdated, serverUpdatedHero],
                initialCache.Hero,
                NxaMergeStrategy.PreserveChanges // manually provide strategy
            );

            expect(collection.entities[unchangedHero.id]).toEqual(
                unchangedHeroServerUpdated,
                'Replace the current collection entity for unchanged entity'
            );
            expect(collection.entities[updatedHero.id]).toEqual(
                locallyUpdatedHero,
                'Preserves the current value for changed entity'
            );
            expect(collection.changeState[updatedHero.id]!.originalValue).toEqual(
                serverUpdatedHero,
                'Overwrites the originalValue with the merge entity'
            );
        });

        it('should be able to use overwrite changes strategy', () => {
            const {
                unchangedHero,
                unchangedHeroServerUpdated,
                updatedHero,
                serverUpdatedHero,
                initialCache,
            } = createInitialCacheForMerges();

            const collection = tracker.mergeSaveUpserts(
                [unchangedHeroServerUpdated, serverUpdatedHero],
                initialCache.Hero,
                NxaMergeStrategy.OverwriteChanges // manually provide strategy
            );

            expect(collection.entities[unchangedHero.id]).toEqual(
                unchangedHeroServerUpdated,
                'Replace the current collection entity for unchanged entity'
            );
            expect(collection.changeState[unchangedHero.id]).toBeUndefined(
                'Discards the changeState (changeType unchanged) for unchanged entity'
            );
            expect(collection.entities[updatedHero.id]).toEqual(
                serverUpdatedHero,
                'Replace the current collection entity for changed entity'
            );
            expect(collection.changeState[updatedHero.id]).toBeUndefined(
                'Discards the changeState (changeType unchanged) for changed entity'
            );
        });
    });

    describe('#trackAddOne', () => {
        it('should return a new collection with tracked new entity', () => {
            const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
            const collection = tracker.trackAddOne(addedEntity, origCollection);

            expect(collection).not.toBe(origCollection);
            const change = collection.changeState[addedEntity.id];
            expect(change).toBeDefined('tracking the entity');
            expectNxaChangeType(change, NxaChangeType.Added);
            expect(change!.originalValue).toBeUndefined(
                'no original value for a new entity'
            );
        });

        it('should leave added entity tracked as added when entity is updated', () => {
            const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
            let collection = tracker.trackAddOne(addedEntity, origCollection);

            const updatedEntity = { ...addedEntity, name: 'Double Test' };
            collection = tracker.trackUpdateOne(toUpdate(updatedEntity), collection);
            // simulate the collection update
            collection.entities[addedEntity.id] = updatedEntity;

            const change = collection.changeState[updatedEntity.id];
            expect(change).toBeDefined('is still tracked as an added entity');
            expectNxaChangeType(change, NxaChangeType.Added);
            expect(change!.originalValue).toBeUndefined(
                'still no original value for added entity'
            );
        });

        it('should return same collection if called with null entity', () => {
            const collection = tracker.trackAddOne(null as any, origCollection);
            expect(collection).toBe(origCollection);
        });

        it('should return the same collection if NxaMergeStrategy.IgnoreChanges', () => {
            const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
            const collection = tracker.trackAddOne(
                addedEntity,
                origCollection,
                NxaMergeStrategy.IgnoreChanges
            );

            expect(collection).toBe(origCollection);
            const change = collection.changeState[addedEntity.id];
            expect(change).toBeUndefined('not tracking the entity');
        });
    });

    describe('#trackAddMany', () => {
        const newEntities = [
            { id: 42, name: 'Ted', power: 'Chatty' },
            { id: 84, name: 'Sally', power: 'Laughter' },
        ];

        it('should return a new collection with tracked new entities', () => {
            const collection = tracker.trackAddMany(newEntities, origCollection);
            expect(collection).not.toBe(origCollection);
            const trackKeys = Object.keys(collection.changeState);
            expect(trackKeys).toEqual(['42', '84'], 'tracking new entities');

            trackKeys.forEach((key, ix) => {
                const change = collection.changeState[key];
                expect(change).toBeDefined(`tracking the entity ${key}`);
                expectNxaChangeType(
                    change,
                    NxaChangeType.Added,
                    `tracking ${key} as a new entity`
                );
                expect(change!.originalValue).toBeUndefined(
                    `no original value for new entity ${key}`
                );
            });
        });

        it('should return same collection if called with empty array', () => {
            const collection = tracker.trackAddMany([] as any, origCollection);
            expect(collection).toBe(origCollection);
        });
    });

    describe('#trackDeleteOne', () => {
        it('should return a new collection with tracked "deleted" entity', () => {
            const existingEntity = getFirstExistingEntity();
            const collection = tracker.trackDeleteOne(
                existingEntity!.id,
                origCollection
            );
            expect(collection).not.toBe(origCollection);
            const change = collection.changeState[existingEntity!.id];
            expect(change).toBeDefined('tracking the entity');
            expectNxaChangeType(change, NxaChangeType.Deleted);
            expect(change!.originalValue).toBe(
                existingEntity,
                'originalValue is the existing entity'
            );
        });

        it('should return a new collection with tracked "deleted" entity, deleted by key', () => {
            const existingEntity = getFirstExistingEntity();
            const collection = tracker.trackDeleteOne(
                existingEntity!.id,
                origCollection
            );
            expect(collection).not.toBe(origCollection);
            const change = collection.changeState[existingEntity!.id];
            expect(change).toBeDefined('tracking the entity');
            expectNxaChangeType(change, NxaChangeType.Deleted);
            expect(change!.originalValue).toBe(
                existingEntity,
                'originalValue is the existing entity'
            );
        });

        it('should untrack (commit) an added entity when it is removed', () => {
            const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
            let collection = tracker.trackAddOne(addedEntity, origCollection);

            // Add it to the collection as the reducer would
            collection = {
                ...collection,
                entities: { ...collection.entities, 42: addedEntity },
                ids: (collection.ids as number[]).concat(42),
            };

            let change = collection.changeState[addedEntity.id];
            expect(change).toBeDefined('tracking the new entity');

            collection = tracker.trackDeleteOne(addedEntity.id, collection);
            change = collection.changeState[addedEntity.id];
            expect(change).not.toBeDefined('is no longer tracking the new entity');
        });

        it('should switch an updated entity to a deleted entity when it is removed', () => {
            const existingEntity = getFirstExistingEntity();
            const updatedEntity = toUpdate({
                ...existingEntity,
                name: 'test update',
            });

            let collection = tracker.trackUpdateOne(
                toUpdate(updatedEntity),
                origCollection
            );

            let change = collection.changeState[updatedEntity.id];
            expect(change).toBeDefined('tracking the updated existing entity');
            expectNxaChangeType(change, NxaChangeType.Updated, 'updated at first');

            collection = tracker.trackDeleteOne(updatedEntity.id, collection);
            change = collection.changeState[updatedEntity.id];
            expect(change).toBeDefined('tracking the deleted, updated entity');
            expectNxaChangeType(change, NxaChangeType.Deleted, 'after delete');
            expect(change!.originalValue).toEqual(
                existingEntity,
                'tracking original value'
            );
        });

        it('should leave deleted entity tracked as deleted when try to update', () => {
            const existingEntity = getFirstExistingEntity();
            let collection = tracker.trackDeleteOne(
                existingEntity!.id,
                origCollection
            );

            let change = collection.changeState[existingEntity!.id];
            expect(change).toBeDefined('tracking the deleted entity');
            expectNxaChangeType(change, NxaChangeType.Deleted);

            // This shouldn't be possible but let's try it.
            const updatedEntity: any = { ...existingEntity, name: 'Double Test' };
            collection.entities[existingEntity!.id] = updatedEntity;

            collection = tracker.trackUpdateOne(toUpdate(updatedEntity), collection);
            change = collection.changeState[updatedEntity.id];
            expect(change).toBeDefined('is still tracked as a deleted entity');
            expectNxaChangeType(change, NxaChangeType.Deleted);
            expect(change!.originalValue).toEqual(
                existingEntity,
                'still tracking original value'
            );
        });

        it('should return same collection if called with null entity', () => {
            const collection = tracker.trackDeleteOne(null as any, origCollection);
            expect(collection).toBe(origCollection);
        });

        it('should return same collection if called with a key not found', () => {
            const collection = tracker.trackDeleteOne('1234', origCollection);
            expect(collection).toBe(origCollection);
        });

        it('should return same collection if NxaMergeStrategy.IgnoreChanges', () => {
            const existingEntity = getFirstExistingEntity();
            const collection = tracker.trackDeleteOne(
                existingEntity!.id,
                origCollection,
                NxaMergeStrategy.IgnoreChanges
            );
            expect(collection).toBe(origCollection);
            const change = collection.changeState[existingEntity!.id];
            expect(change).toBeUndefined('not tracking the entity');
        });
    });

    describe('#trackDeleteMany', () => {
        it('should return a new collection with tracked "deleted" entities', () => {
            const existingEntities = getSomeExistingEntities(2);
            const collection = tracker.trackDeleteMany(
                existingEntities.map(e => e!.id),
                origCollection
            );
            expect(collection).not.toBe(origCollection);
            existingEntities.forEach((entity, ix) => {
                const change = collection.changeState[existingEntities[ix]!.id];
                expect(change).toBeDefined(`tracking entity #${ix}`);
                expectNxaChangeType(change, NxaChangeType.Deleted, `entity #${ix}`);
                expect(change!.originalValue).toBe(
                    existingEntities[ix],
                    `entity #${ix} originalValue`
                );
            });
        });

        it('should return same collection if called with empty array', () => {
            const collection = tracker.trackDeleteMany([], origCollection);
            expect(collection).toBe(origCollection);
        });

        it('should return same collection if called with a key not found', () => {
            const collection = tracker.trackDeleteMany(['1234', 456], origCollection);
            expect(collection).toBe(origCollection);
        });
    });

    describe('#trackUpdateOne', () => {
        it('should return a new collection with tracked updated entity', () => {
            const existingEntity = getFirstExistingEntity();
            const updatedEntity = toUpdate({
                ...existingEntity,
                name: 'test update',
            });
            const collection = tracker.trackUpdateOne(updatedEntity, origCollection);
            expect(collection).not.toBe(origCollection);
            const change = collection.changeState[existingEntity!.id];
            expect(change).toBeDefined('tracking the entity');
            expectNxaChangeType(change, NxaChangeType.Updated);
            expect(change!.originalValue).toBe(
                existingEntity,
                'originalValue is the existing entity'
            );
        });

        it('should return a new collection with tracked updated entity, updated by key', () => {
            const existingEntity = getFirstExistingEntity();
            const updatedEntity = toUpdate({
                ...existingEntity,
                name: 'test update',
            });
            const collection = tracker.trackUpdateOne(updatedEntity, origCollection);
            expect(collection).not.toBe(origCollection);
            const change = collection.changeState[existingEntity!.id];
            expect(change).toBeDefined('tracking the entity');
            expectNxaChangeType(change, NxaChangeType.Updated);
            expect(change!.originalValue).toBe(
                existingEntity,
                'originalValue is the existing entity'
            );
        });

        it('should leave updated entity tracked as updated if try to add', () => {
            const existingEntity = getFirstExistingEntity();
            const updatedEntity = toUpdate({
                ...existingEntity,
                name: 'test update',
            });
            let collection = tracker.trackUpdateOne(updatedEntity, origCollection);

            let change = collection.changeState[existingEntity!.id];
            expect(change).toBeDefined('tracking the updated entity');
            expectNxaChangeType(change, NxaChangeType.Updated);

            // This shouldn't be possible but let's try it.
            const addedEntity: any = { ...existingEntity, name: 'Double Test' };
            collection.entities[existingEntity!.id] = addedEntity;

            collection = tracker.trackAddOne(addedEntity, collection);
            change = collection.changeState[addedEntity.id];
            expect(change).toBeDefined('is still tracked as an updated entity');
            expectNxaChangeType(change, NxaChangeType.Updated);
            expect(change!.originalValue).toEqual(
                existingEntity,
                'still tracking original value'
            );
        });

        it('should return same collection if called with null entity', () => {
            const collection = tracker.trackUpdateOne(null as any, origCollection);
            expect(collection).toBe(origCollection);
        });

        it('should return same collection if called with a key not found', () => {
            const updateEntity = toUpdate({ id: '1234', name: 'Mr. 404' });
            const collection = tracker.trackUpdateOne(updateEntity, origCollection);
            expect(collection).toBe(origCollection);
        });

        it('should return same collection if NxaMergeStrategy.IgnoreChanges', () => {
            const existingEntity = getFirstExistingEntity();
            const updatedEntity = toUpdate({
                ...existingEntity,
                name: 'test update',
            });
            const collection = tracker.trackUpdateOne(
                updatedEntity,
                origCollection,
                NxaMergeStrategy.IgnoreChanges
            );
            expect(collection).toBe(origCollection);
            const change = collection.changeState[existingEntity!.id];
            expect(change).toBeUndefined('not tracking the entity');
        });
    });

    describe('#trackUpdateMany', () => {
        it('should return a new collection with tracked updated entities', () => {
            const existingEntities = getSomeExistingEntities(2);
            const updateEntities = existingEntities.map(e =>
                toUpdate({ ...e, name: e!.name + ' updated' })
            );
            const collection = tracker.trackUpdateMany(
                updateEntities,
                origCollection
            );
            expect(collection).not.toBe(origCollection);
            existingEntities.forEach((entity, ix) => {
                const change = collection.changeState[existingEntities[ix]!.id];
                expect(change).toBeDefined(`tracking entity #${ix}`);
                expectNxaChangeType(change, NxaChangeType.Updated, `entity #${ix}`);
                expect(change!.originalValue).toBe(
                    existingEntities[ix],
                    `entity #${ix} originalValue`
                );
            });
        });

        it('should return same collection if called with empty array', () => {
            const collection = tracker.trackUpdateMany([], origCollection);
            expect(collection).toBe(origCollection);
        });

        it('should return same collection if called with entities whose keys are not found', () => {
            const updateEntities = [
                toUpdate({ id: '1234', name: 'Mr. 404' }),
                toUpdate({ id: 456, name: 'Ms. 404' }),
            ];
            const collection = tracker.trackUpdateMany(
                updateEntities,
                origCollection
            );
            expect(collection).toBe(origCollection);
        });
    });

    describe('#trackUpsertOne', () => {
        it('should return a new collection with tracked added entity', () => {
            const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
            const collection = tracker.trackUpsertOne(addedEntity, origCollection);
            expect(collection).not.toBe(origCollection);
            const change = collection.changeState[addedEntity.id];
            expect(change).toBeDefined('tracking the entity');
            expectNxaChangeType(change, NxaChangeType.Added);
            expect(change!.originalValue).toBeUndefined(
                'no originalValue for added entity'
            );
        });

        it('should return a new collection with tracked updated entity', () => {
            const existingEntity = getFirstExistingEntity();
            const collection = tracker.trackUpsertOne(
                existingEntity as Hero,
                origCollection
            );
            expect(collection).not.toBe(origCollection);
            const change = collection.changeState[existingEntity!.id];
            expect(change).toBeDefined('tracking the entity');
            expectNxaChangeType(change, NxaChangeType.Updated);
            expect(change!.originalValue).toBe(
                existingEntity,
                'originalValue is the existing entity'
            );
        });

        it('should not change orig value of updated entity that is updated again', () => {
            const existingEntity = getFirstExistingEntity();
            let collection = tracker.trackUpsertOne(
                existingEntity as Hero,
                origCollection
            );

            let change = collection.changeState[existingEntity!.id];
            expect(change).toBeDefined('tracking the updated entity');
            expectNxaChangeType(change, NxaChangeType.Updated, 'first updated');

            const updatedAgainEntity = {
                ...existingEntity,
                name: 'Double Test',
            } as Hero;

            collection = tracker.trackUpsertOne(
                updatedAgainEntity as Hero,
                collection
            );
            change = collection.changeState[updatedAgainEntity.id];
            expect(change).toBeDefined('is still tracked as an updated entity');
            expectNxaChangeType(
                change,
                NxaChangeType.Updated,
                'still updated after attempted add'
            );
            expect(change!.originalValue).toEqual(
                existingEntity,
                'still tracking original value'
            );
        });

        it('should return same collection if called with null entity', () => {
            const collection = tracker.trackUpsertOne(null as any, origCollection);
            expect(collection).toBe(origCollection);
        });

        it('should return same collection if NxaMergeStrategy.IgnoreChanges', () => {
            const existingEntity = getFirstExistingEntity();
            const updatedEntity = { ...existingEntity, name: 'test update' };
            const collection = tracker.trackUpsertOne(
                updatedEntity as Hero,
                origCollection,
                NxaMergeStrategy.IgnoreChanges
            );
            expect(collection).toBe(origCollection);
            const change = collection.changeState[existingEntity!.id];
            expect(change).toBeUndefined('not tracking the entity');
        });
    });

    describe('#trackUpsertMany', () => {
        it('should return a new collection with tracked upserted entities', () => {
            const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
            const exitingEntities = getSomeExistingEntities(2);
            const updatedEntities = exitingEntities.map(e => ({
                ...e,
                name: e!.name + 'test',
            }));
            const upsertEntities = updatedEntities.concat(addedEntity);
            const collection = tracker.trackUpsertMany(
                upsertEntities as Hero[],
                origCollection
            );
            expect(collection).not.toBe(origCollection);
            updatedEntities.forEach((entity, ix) => {
                const change = collection.changeState[(updatedEntities[ix] as Hero).id];
                expect(change).toBeDefined(`tracking entity #${ix}`);
                // first two should be updated, the 3rd is added
                expectNxaChangeType(
                    change,
                    ix === 2 ? NxaChangeType.Added : NxaChangeType.Updated,
                    `entity #${ix}`
                );
                if (change!.changeType === NxaChangeType.Updated) {
                    expect(change!.originalValue).toBe(
                        exitingEntities[ix],
                        `entity #${ix} originalValue`
                    );
                } else {
                    expect(change!.originalValue).toBeUndefined(
                        `no originalValue for added entity #${ix}`
                    );
                }
            });
        });

        it('should return same collection if called with empty array', () => {
            const collection = tracker.trackUpsertMany([], origCollection);
            expect(collection).toBe(origCollection);
        });
    });

    describe('#undoAll', () => {
        it('should clear all tracked changes', () => {
            let { collection } = createTestTrackedEntities();
            expect(Object.keys(collection.changeState).length).toBe(
                3,
                'tracking 3 entities'
            );

            collection = tracker.undoAll(collection);
            expect(Object.keys(collection.changeState).length).toBe(
                0,
                'tracking zero entities'
            );
        });

        it('should restore the collection to the pre-change state', () => {
            // tslint:disable-next-line:prefer-const
            let {
                collection,
                addedEntity,
                deletedEntity,
                preUpdatedEntity,
                updatedEntity,
            } = createTestTrackedEntities();

            // Before undo
            expect(collection.entities[addedEntity.id]).toBeDefined(
                'added entity should be present'
            );
            expect(collection.entities[deletedEntity!.id]).toBeUndefined(
                'deleted entity should be missing'
            );
            expect(updatedEntity.name).not.toEqual(
                preUpdatedEntity!.name,
                'updated entity should be changed'
            );

            collection = tracker.undoAll(collection);

            // After undo
            expect(collection.entities[addedEntity.id]).toBeUndefined(
                'added entity should be removed'
            );
            expect(collection.entities[deletedEntity!.id]).toBeDefined(
                'deleted entity should be restored'
            );
            const revertedUpdate = collection.entities[updatedEntity.id];
            expect(revertedUpdate!.name).toEqual(
                preUpdatedEntity!.name,
                'updated entity should be restored'
            );
        });
    });

    describe('#undoOne', () => {
        it('should clear one tracked change', () => {
            let { collection, deletedEntity } = createTestTrackedEntities();

            expect(Object.keys(collection.changeState).length).toBe(
                3,
                'tracking 3 entities'
            );

            collection = tracker.undoOne(deletedEntity as Hero, collection);

            expect(Object.keys(collection.changeState).length).toBe(
                2,
                'tracking 2 entities'
            );
        });

        it('should restore the collection to the pre-change state for the given entity', () => {
            // tslint:disable-next-line:prefer-const
            let {
                collection,
                addedEntity,
                deletedEntity,
                preUpdatedEntity,
                updatedEntity,
            } = createTestTrackedEntities();

            collection = tracker.undoOne(deletedEntity as Hero, collection);

            expect(collection.entities[deletedEntity!.id]).toBeDefined(
                'deleted entity should be restored'
            );
            expect(collection.entities[addedEntity.id]).toBeDefined(
                'added entity should still be present'
            );
            expect(updatedEntity.name).not.toEqual(
                preUpdatedEntity!.name,
                'updated entity should be changed'
            );
        });

        it('should do nothing when the given entity is null', () => {
            // tslint:disable-next-line:prefer-const
            let {
                collection,
                addedEntity,
                deletedEntity,
                preUpdatedEntity,
                updatedEntity,
            } = createTestTrackedEntities();

            collection = tracker.undoOne(null as any, collection);
            expect(collection.entities[addedEntity.id]).toBeDefined(
                'added entity should be present'
            );
            expect(collection.entities[deletedEntity!.id]).toBeUndefined(
                'deleted entity should be missing'
            );
            expect(updatedEntity.name).not.toEqual(
                preUpdatedEntity!.name,
                'updated entity should be changed'
            );
        });
    });

    describe('#undoMany', () => {
        it('should clear many tracked changes', () => {
            // tslint:disable-next-line:prefer-const
            let {
                collection,
                addedEntity,
                deletedEntity,
                preUpdatedEntity,
                updatedEntity,
            } = createTestTrackedEntities();

            expect(Object.keys(collection.changeState).length).toBe(
                3,
                'tracking 3 entities'
            );

            collection = tracker.undoMany(
                [addedEntity, deletedEntity, updatedEntity],
                collection
            );

            expect(Object.keys(collection.changeState).length).toBe(
                0,
                'tracking 2 entities'
            );
        });

        it('should restore the collection to the pre-change state for the given entities', () => {
            // tslint:disable-next-line:prefer-const
            let {
                collection,
                addedEntity,
                deletedEntity,
                preUpdatedEntity,
                updatedEntity,
            } = createTestTrackedEntities();

            collection = tracker.undoMany(
                [addedEntity, deletedEntity, updatedEntity],
                collection
            );
            expect(collection.entities[addedEntity.id]).toBeUndefined(
                'added entity should be removed'
            );
            expect(collection.entities[deletedEntity!.id]).toBeDefined(
                'deleted entity should be restored'
            );
            const revertedUpdate = collection.entities[updatedEntity.id];
            expect(revertedUpdate!.name).toEqual(
                preUpdatedEntity!.name,
                'updated entity should be restored'
            );
        });

        it('should do nothing when there are no entities to undo', () => {
            // tslint:disable-next-line:prefer-const
            let {
                collection,
                addedEntity,
                deletedEntity,
                preUpdatedEntity,
                updatedEntity,
            } = createTestTrackedEntities();

            collection = tracker.undoMany([], collection);
            expect(collection.entities[addedEntity.id]).toBeDefined(
                'added entity should be present'
            );
            expect(collection.entities[deletedEntity!.id]).toBeUndefined(
                'deleted entity should be missing'
            );
            expect(updatedEntity.name).not.toEqual(
                preUpdatedEntity!.name,
                'updated entity should be changed'
            );
        });
    });

    /// helpers ///

    /** Simulate the state of the collection after some test changes */
    function createTestTrackedEntities() {
        const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
        const [deletedEntity, preUpdatedEntity] = getSomeExistingEntities(2);
        const updatedEntity: any = { ...preUpdatedEntity, name: 'Test Me' };

        let collection = tracker.trackAddOne(addedEntity, origCollection);
        collection = tracker.trackDeleteOne(deletedEntity!.id, collection);
        collection = tracker.trackUpdateOne(toUpdate(updatedEntity), collection);

        // Make the collection match these changes
        collection.ids = (collection.ids.slice(
            1,
            collection.ids.length
        ) as number[]).concat(42);
        const entities: { [id: number]: Hero } = {
            ...collection.entities,
            42: addedEntity,
            [updatedEntity.id]: updatedEntity,
        };
        delete entities[deletedEntity!.id];
        collection.entities = entities;
        return {
            collection,
            addedEntity,
            deletedEntity,
            preUpdatedEntity,
            updatedEntity,
        };
    }

    function createInitialCacheForMerges() {
        // general test data for testing mergeStrategy
        const unchangedHero = { id: 1, name: 'Unchanged', power: 'Hammer' };
        const unchangedHeroServerUpdated = {
            id: 1,
            name: 'UnchangedUpdated',
            power: 'Bish',
        };
        const deletedHero = { id: 2, name: 'Deleted', power: 'Bash' };
        const addedHero = { id: 3, name: 'Added', power: 'Tiny' };
        const updatedHero = { id: 4, name: 'Pre Updated', power: 'Tech' };
        const locallyUpdatedHero = {
            id: 4,
            name: 'Locally Updated',
            power: 'Suit',
        };
        const serverUpdatedHero = { id: 4, name: 'Server Updated', power: 'Nano' };
        const ids = [unchangedHero.id, addedHero.id, updatedHero.id];
        const initialCache = {
            Hero: {
                ids,
                entities: {
                    [unchangedHero.id]: unchangedHero,
                    [addedHero.id]: addedHero,
                    [updatedHero.id]: locallyUpdatedHero,
                },
                entityName: 'Hero',
                filter: '',
                loaded: true,
                loading: false,
                changeState: {
                    [deletedHero.id]: {
                        changeType: NxaChangeType.Deleted,
                        originalValue: deletedHero,
                    },
                    [updatedHero.id]: {
                        changeType: NxaChangeType.Updated,
                        originalValue: updatedHero,
                    },
                    [addedHero.id]: { changeType: NxaChangeType.Added },
                },
            },
        };
        return {
            unchangedHero,
            unchangedHeroServerUpdated,
            deletedHero,
            addedHero,
            updatedHero,
            locallyUpdatedHero,
            serverUpdatedHero,
            initialCache,
        };
    }

    /** Test for NxaChangeState with expected NxaChangeType */
    function expectNxaChangeType(
        change: NxaChangeState<any> | undefined,
        expectedNxaChangeType: NxaChangeType,
        msg?: string
    ) {
        expect(NxaChangeType[change!.changeType]).toEqual(
            NxaChangeType[expectedNxaChangeType],
            msg
        );
    }

    /** Get the first entity in `originalCollection`  */
    function getFirstExistingEntity() {
        return getExistingEntityById(origCollection.ids[0]);
    }

    /**
     * Get the first 'n' existing entities from `originalCollection`
     * @param n Number of them to get
     */
    function getSomeExistingEntities(n: number) {
        const ids = (origCollection.ids as string[]).slice(0, n);
        return getExistingEntitiesById(ids);
    }

    function getExistingEntityById(id: number | string) {
        return getExistingEntitiesById([id as string])[0];
    }

    function getExistingEntitiesById(ids: string[]) {
        return ids.map(id => origCollection.entities[id]);
    }
});