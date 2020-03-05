import { take } from 'rxjs/operators';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { NxaDefaultOfflineService } from "../../lib/offline-services/default-offline.service";
import { NxaEntitySelectorsFactory } from '../../lib/selectors/entity-selectors';
import { NxaEntityCollection, NxaChangeType } from '../../lib';
import { Update } from '@ngrx/entity';

class Hero {
    id!: number;
    name!: string;
    version?: number;
}

fdescribe('NxaDefaultOfflineService', () => {
    // TODO: add tests
    let randomString = ''

    let service: NxaDefaultOfflineService<Hero>
    let nxaCollectionCreator: any;
    let nxaEntitySelectorsFactory: NxaEntitySelectorsFactory;

    beforeEach(() => {
        randomString = makeid(10)
        let store: MockStore<NxaEntityCollection<Hero>>
        const { initialCache } = createInitialCacheForMerges()
        let initialState = initialCache.Hero;

        TestBed.configureTestingModule({
            providers: [
                provideMockStore({ initialState })
            ],
        });

        store = TestBed.get(Store);

        nxaCollectionCreator = jasmine.createSpyObj('nxaEntityCollectionCreator', [
            'create',
        ]);
        nxaEntitySelectorsFactory = new NxaEntitySelectorsFactory(nxaCollectionCreator);

        service = new NxaDefaultOfflineService(
            'Hero',
            nxaEntitySelectorsFactory,
            store,
            {
                dbName: "spec-test-" + randomString,
                dbVersion: 1,
                idbConfig: {
                    Hero: { keyPath: "id" }
                }
            }
        );
        service.openDB$().pipe(take(1)).subscribe(db => {
            db.close()
        })
    });

    afterEach(() => {
        service.deleteDB("spec-test-" + randomString)
    });

    describe('property inspection', () => {
        // TODO: add tests
    });

    describe('#getAll', () => {
        // TODO: add tests
    });

    describe('#getById', () => {
        // TODO: add tests
    });

    describe('#getWithQuery', () => {
        // TODO: add tests
    });

    fdescribe('#add', () => {

        it('should return expected hero with id (required)', (done: DoneFn) => {
            const heroData: Hero = { id: 42, name: 'A' }
            service
                .add(heroData)
                .subscribe(hero => {
                    expect(hero).toEqual(heroData, 'should return expected hero')
                    done()
                },
                    fail
                );

        });
    });

    fdescribe('#delete', () => {
        // TODO: add tests
        it('should delete by hero id an unchanged hero', (done: DoneFn) => {
            const { unchangedHero } = createInitialCacheForMerges()
            service
                .delete(unchangedHero.id)
                .subscribe(
                    result => {
                        expect(result).toEqual(unchangedHero.id, 'should return the deleted entity id')
                        done()
                    },
                    fail
                );
        });

        it('should delete by hero id an added hero', (done: DoneFn) => {
            const { addedHero } = createInitialCacheForMerges()
            service
                .delete(addedHero.id)
                .subscribe(
                    result => {
                        expect(result).toEqual(addedHero.id, 'should return the deleted entity id')
                        done()
                    },
                    fail
                );
        });

        it('should delete by hero id an updated hero', (done: DoneFn) => {
            const { updatedHero } = createInitialCacheForMerges()
            service
                .delete(updatedHero.id)
                .subscribe(
                    result => {
                        expect(result).toEqual(updatedHero.id, 'should return the deleted entity id')
                        done()
                    },
                    fail
                );
        });

        it('should delete by hero id an deleted hero', (done: DoneFn) => {
            const { deletedHero } = createInitialCacheForMerges()
            service
                .delete(deletedHero.id)
                .subscribe(
                    result => {
                        expect(result).toEqual(deletedHero.id, 'should return the deleted entity id')
                        done()
                    },
                    fail
                );
        });
    });

    fdescribe('#update', () => {
        // TODO: add tests
        it('should update an unchanged hero', (done: DoneFn) => {
            const { unchangedHero } = createInitialCacheForMerges()

            const update: Update<Hero> = {
                id: unchangedHero.id,
                changes: {
                    name: 'unchangedHeroUpdated'
                }
            }

            const unchangedHeroUpdated = {
                ...unchangedHero,
                name: 'unchangedHeroUpdated'
            }

            service
                .update(update)
                .subscribe(
                    result => {
                        expect(result).toEqual(unchangedHeroUpdated, 'should return the changed entity')
                        done()
                    },
                    fail
                );
        });

        it('should update an added hero', (done: DoneFn) => {
            const { addedHero } = createInitialCacheForMerges()

            const update: Update<Hero> = {
                id: addedHero.id,
                changes: {
                    name: 'addedHeroUpdated'
                }
            }

            const addedHeroUpdated = {
                ...addedHero,
                name: 'addedHeroUpdated'
            }

            service
                .update(update)
                .subscribe(
                    result => {
                        expect(result).toEqual(addedHeroUpdated, 'should return the changed entity')
                        done()
                    },
                    fail
                );
        });

        it('should throw when trying to update an deleted hero', (done: DoneFn) => {
            const { deletedHero } = createInitialCacheForMerges()

            const update: Update<Hero> = {
                id: deletedHero.id,
                changes: {
                    name: 'deletedHeroUpdated'
                }
            }

            service
                .update(update)
                .subscribe(
                    result => fail('update succeeded when expected it to fail'),
                    err => {
                        expect(err.error).toMatch(/Cannot update deleted entity/);
                        done()
                    }
                );
        });


        it('should update an updated hero with both existing and new local updates', (done: DoneFn) => {
            const { updatedHero, locallyUpdatedHero } = createInitialCacheForMerges()

            const update: Update<Hero> = {
                id: updatedHero.id,
                changes: {
                    name: 'updatedHeroUpdated'
                }
            }

            const updatedHeroUpdated = {
                ...updatedHero,
                ...locallyUpdatedHero,
                name: 'updatedHeroUpdated'
            }

            service
                .update(update)
                .subscribe(
                    result => {
                        expect(result).toEqual(updatedHeroUpdated, 'should return the changed entity')
                        done()
                    },
                    fail
                );
        });

    });

    fdescribe('#upsert', () => {
        // TODO: add tests
        it('should update an unchanged hero', (done: DoneFn) => {
            const { unchangedHero } = createInitialCacheForMerges()

            const unchangedHeroUpdated = {
                ...unchangedHero,
                name: 'unchangedHeroUpdated'
            }

            service
                .upsert(unchangedHeroUpdated)
                .subscribe(
                    result => {
                        expect(result).toEqual(unchangedHeroUpdated, 'should return the entity')
                        done()
                    },
                    fail
                );
        });

        it('should update an added hero', (done: DoneFn) => {
            const { addedHero } = createInitialCacheForMerges()

            const addedHeroUpdated = {
                ...addedHero,
                name: 'addedHeroUpdated'
            }

            service
                .upsert(addedHeroUpdated)
                .subscribe(
                    result => {
                        expect(result).toEqual(addedHeroUpdated, 'should return the updated entity')
                        done()
                    },
                    fail
                );
        });

        it('should throw when trying to upsert an deleted hero', (done: DoneFn) => {
            const { deletedHero } = createInitialCacheForMerges()
            service
                .upsert(deletedHero)
                .subscribe(
                    result => fail('update succeeded when expected it to fail'),
                    err => {
                        expect(err.error).toMatch(/Cannot upsert deleted entity/);
                        done()
                    }
                );
        });

        it('should update an updated hero with both existing and (if partial provided) local updates ', (done: DoneFn) => {
            const { updatedHero, locallyUpdatedHero } = createInitialCacheForMerges()

            const updatedHeroUpdated = {
                id: updatedHero.id,
                name: 'updatedHeroUpdated'
            }

            const updatedHeroUpdatedBoth = {
                ...updatedHero,
                ...locallyUpdatedHero,
                name: 'updatedHeroUpdated'
            }

            service
                .upsert(updatedHeroUpdated)
                .subscribe(
                    result => {
                        expect(result).toEqual(updatedHeroUpdatedBoth, 'should return the entity')
                        done()
                    },
                    fail
                );
        });
    });
});


describe('NxaDefaultDataServiceFactory', () => {


    beforeEach(() => {

    });

    describe('(no config)', () => {
        it('can create factory', () => {
            // TODO: add tests
        });

        it('should produce hero offline service that gets all heroes with expected db name', () => {
            // TODO: add tests
        });
    });

    describe('(with config)', () => {
        // TODO: add tests
    });
});


/** Helpers */

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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