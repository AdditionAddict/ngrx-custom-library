import { TestBed } from '@angular/core/testing';
import { Action, StoreModule, Store } from '@ngrx/store';
import { Actions, EffectsModule } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { first, skip } from 'rxjs/operators';

import {
    NxaEntityAction,
    NxaEntityOp,
    NxaEntityCacheQuerySet,
    NxaMergeQuerySet,
    NxaEntityMetadataMap,
    NxaEntityDataModule,
    NxaEntityCacheEffects,
    NxaEntityDataService,
    NxaEntityActionFactory,
    NxaEntityDispatcherFactory,
    NxaEntityServices,
    NxaEntityCache,
    NxaHttpMethods,
    NxaDataServiceError,
    Logger,
} from '../../lib';

describe('EntityServices', () => {
    describe('NxaEntityActionErrors$', () => {
        it('should emit NxaEntityAction errors for multiple entity types', () => {
            const errors: NxaEntityAction[] = [];
            const { nxaEntityActionFactory, entityServices } = entityServicesSetup();
            entityServices.NxaEntityActionErrors$.subscribe(error => errors.push(error));

            entityServices.dispatch({ type: 'not-an-entity-action' });
            entityServices.dispatch(
                nxaEntityActionFactory.create('Hero', NxaEntityOp.QUERY_ALL)
            ); // not an error
            entityServices.dispatch(
                nxaEntityActionFactory.create(
                    'Hero',
                    NxaEntityOp.QUERY_ALL_ERROR,
                    makeNxaDataServiceError('GET', new Error('Bad hero news'))
                )
            );
            entityServices.dispatch(
                nxaEntityActionFactory.create('Villain', NxaEntityOp.QUERY_ALL)
            ); // not an error
            entityServices.dispatch(
                nxaEntityActionFactory.create(
                    'Villain',
                    NxaEntityOp.SAVE_ADD_ONE_ERROR,
                    makeNxaDataServiceError('PUT', new Error('Bad villain news'))
                )
            );

            expect(errors.length).toBe(2);
        });
    });

    describe('entityCache$', () => {
        it('should observe the entire entity cache', () => {
            const entityCacheValues: any = [];

            const {
                nxaEntityActionFactory,
                entityServices,
                store,
            } = entityServicesSetup();

            // entityCache$.subscribe() callback invoked immediately. The cache is empty at first.
            entityServices.entityCache$.subscribe(ec => entityCacheValues.push(ec));

            // This first action to go through the Hero's EntityCollectionReducer
            // creates the collection in the NxaEntityCache as a side-effect,
            // triggering the second entityCache$.subscribe() callback
            const heroAction = nxaEntityActionFactory.create(
                'Hero',
                NxaEntityOp.SET_FILTER,
                'test'
            );
            store.dispatch(heroAction);

            expect(entityCacheValues.length).toEqual(
                2,
                'entityCache$ callback twice'
            );
            expect(entityCacheValues[0]).toEqual({}, 'empty at first');
            expect(entityCacheValues[1].Hero).toBeDefined('has Hero collection');
        });
    });

    describe('dispatch(NxaMergeQuerySet)', () => {
        // using async test to guard against false test pass.
        it('should update entityCache$ twice after merging two individual collections', (done: DoneFn) => {
            const hero1 = { id: 1, name: 'A' } as Hero;
            const hero2 = { id: 2, name: 'B' } as Hero;
            const heroes = [hero1, hero2];

            const villain = { key: 'DE', name: 'Dr. Evil' } as Villain;

            const { entityServices } = entityServicesSetup();
            const heroCollectionService = entityServices.getEntityCollectionService<
                Hero
            >('Hero');
            const villainCollectionService = entityServices.getEntityCollectionService<
                Villain
            >('Villain');

            const entityCacheValues: any = [];
            entityServices.entityCache$.subscribe(cache => {
                entityCacheValues.push(cache);
                if (entityCacheValues.length === 3) {
                    expect(entityCacheValues[0]).toEqual({}, '#1 empty at first');
                    expect(entityCacheValues[1]['Hero'].ids).toEqual(
                        [1, 2],
                        '#2 has heroes'
                    );
                    expect(entityCacheValues[1]['Villain']).toBeUndefined(
                        '#2 does not have Villain collection'
                    );
                    expect(entityCacheValues[2]['Villain'].entities['DE']).toEqual(
                        villain,
                        '#3 has villain'
                    );
                    done();
                }
            });

            // Emulate what would happen if had queried collections separately
            heroCollectionService.createAndDispatch(
                NxaEntityOp.QUERY_MANY_SUCCESS,
                heroes
            );
            villainCollectionService.createAndDispatch(
                NxaEntityOp.QUERY_BY_KEY_SUCCESS,
                villain
            );
        });

        // using async test to guard against false test pass.
        it('should update entityCache$ once when NxaMergeQuerySet multiple collections', (done: DoneFn) => {
            const hero1 = { id: 1, name: 'A' } as Hero;
            const hero2 = { id: 2, name: 'B' } as Hero;
            const heroes = [hero1, hero2];
            const villain = { key: 'DE', name: 'Dr. Evil' } as Villain;
            const querySet: NxaEntityCacheQuerySet = {
                Hero: heroes,
                Villain: [villain],
            };
            const action = new NxaMergeQuerySet(querySet);

            const { entityServices } = entityServicesSetup();

            // Skip initial value. Want the first one after merge is dispatched
            entityServices.entityCache$
                .pipe(
                    skip(1),
                    first()
                )
                .subscribe(cache => {
                    expect(cache['Hero'].ids).toEqual([1, 2], 'has merged heroes');
                    expect(cache['Villain'].entities['DE']).toEqual(
                        villain,
                        'has merged villain'
                    );
                    done();
                });
            entityServices.dispatch(action);
        });
    });
});

// #region test helpers
class Hero {
    id!: number;
    name!: string;
    saying?: string;
}
class Villain {
    key!: string;
    name!: string;
}

const entityMetadata: NxaEntityMetadataMap = {
    Hero: {},
    Villain: { selectId: villain => villain.key },
};

function entityServicesSetup() {
    const logger = jasmine.createSpyObj('Logger', ['error', 'log', 'warn']);

    TestBed.configureTestingModule({
        imports: [
            StoreModule.forRoot({}),
            EffectsModule.forRoot([]),
            NxaEntityDataModule.forRoot({
                entityMetadata: entityMetadata,
            }),
        ],
        /* tslint:disable-next-line:no-use-before-declare */
        providers: [
            { provide: NxaEntityCacheEffects, useValue: {} },
            { provide: NxaEntityDataService, useValue: null },
            { provide: Logger, useValue: logger },
        ],
    });

    const actions$: Observable<Action> = TestBed.get(Actions);
    const nxaEntityActionFactory: NxaEntityActionFactory = TestBed.get(
        NxaEntityActionFactory
    );
    const entityDispatcherFactory: NxaEntityDispatcherFactory = TestBed.get(
        NxaEntityDispatcherFactory
    );
    const entityServices: NxaEntityServices = TestBed.get(NxaEntityServices);
    const store: Store<NxaEntityCache> = TestBed.get(Store);

    return {
        actions$,
        nxaEntityActionFactory,
        entityServices,
        store,
    };
}

/** make error produced by the NxaEntityDataService */
function makeNxaDataServiceError(
    /** Http method for that action */
    method: NxaHttpMethods,
    /** Http error from the web api */
    httpError?: any,
    /** Options sent with the request */
    options?: any
) {
    let url = 'api/heroes';
    if (httpError) {
        url = httpError.url || url;
    } else {
        httpError = { error: new Error('Test error'), status: 500, url };
    }
    return new NxaDataServiceError(httpError, { method, url, options });
}
// #endregion test helpers