import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Action, StoreModule, Store } from '@ngrx/store';
import { Actions, EffectsModule } from '@ngrx/effects';

import { Observable, of, throwError, timer } from 'rxjs';
import { delay, filter, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { commandDispatchTest } from '../dispatchers/entity-dispatcher.spec';

import { NxaEntityMetadataMap } from '../../lib/entity-metadata/entity-metadata';
import { NxaEntityActionFactory } from '../../lib/actions/entity-action-factory';
import { NxaEntityCache } from '../../lib/reducers/entity-cache';
import { Logger } from '../../lib/utils/interfaces';
import { NxaEntityOp, OP_NXA_SUCCESS } from '../../lib/actions/entity-op';
import { NxaDataServiceError } from '../../lib/dataservices/data-service-error';
import { NxaEntityAction, NxaEntityActionOptions } from '../../lib/actions/entity-action';
import { NxaEntityCollectionService } from '../../lib/entity-services/entity-collection-service';
import { NxaEntityDispatcherDefaultOptions } from '../../lib/dispatchers/entity-dispatcher-default-options';
import { NxaPersistanceCanceled } from '../../lib/dispatchers/entity-dispatcher';
import { NxaEntityCacheEffects } from '../../lib/effects/entity-cache-effects';
import { NxaEntityDataModule } from '../../lib/entity-data.module';
import { NxaEntityDataService } from '../../lib/dataservices/entity-data.service';
import { NxaEntityDispatcherFactory } from '../../lib/dispatchers/entity-dispatcher-factory';
import { NxaEntityServices } from '../../lib/entity-services/entity-services';
import { NxaHttpMethods } from '../../lib/dataservices/interfaces';

describe('EntityCollectionService', () => {
    describe('Command dispatching', () => {
        // Borrowing the dispatcher tests from entity-dispatcher.spec.
        // The critical difference: those test didn't invoke the reducers; they do when run here.
        commandDispatchTest(getDispatcher);

        function getDispatcher() {
            const { heroCollectionService, store } = entityServicesSetup();
            const dispatcher = heroCollectionService.dispatcher;
            return { dispatcher, store };
        }
    });

    // TODO: test the effect of NxaMergeStrategy when there are entities in cache with changes
    // This concern is largely met by EntityChangeTracker tests but integration tests would be reassuring.
    describe('queries', () => {
        let heroCollectionService: NxaEntityCollectionService<Hero>;
        let dataService: TestDataService;
        let reducedActions$Snoop: () => void;

        beforeEach(() => {
            ({
                heroCollectionService,
                reducedActions$Snoop,
                dataService,
            } = entityServicesSetup());
        });

        // Compare to next test which subscribes to getAll() result
        it('can use loading$ to learn when getAll() succeeds', (done: DoneFn) => {
            const hero1 = { id: 1, name: 'A' } as Hero;
            const hero2 = { id: 2, name: 'B' } as Hero;
            const heroes = [hero1, hero2];
            dataService.setResponse('getAll', heroes);
            heroCollectionService.getAll();

            // N.B.: This technique does not detect errors
            heroCollectionService.loading$
                .pipe(
                    filter(loading => !loading),
                    withLatestFrom(heroCollectionService.entities$)
                )
                .subscribe(([loading, data]) => {
                    expect(data).toEqual(heroes);
                    done();
                });
        });

        // Compare to previous test the waits for loading$ flag to flip
        it('getAll observable should emit heroes on success', (done: DoneFn) => {
            const hero1 = { id: 1, name: 'A' } as Hero;
            const hero2 = { id: 2, name: 'B' } as Hero;
            const heroes = [hero1, hero2];
            dataService.setResponse('getAll', heroes);
            heroCollectionService.getAll().subscribe(expectDataToBe(heroes, done));

            // reducedActions$Snoop(); // diagnostic
        });

        it('getAll observable should emit expected error when data service fails', (done: DoneFn) => {
            const httpError = { error: new Error('Test Failure'), status: 501 };
            const error = makeNxaDataServiceError('GET', httpError);
            dataService.setErrorResponse('getAll', error);
            heroCollectionService.getAll().subscribe(expectErrorToBe(error, done));
        });

        it('getByKey observable should emit a hero on success', (done: DoneFn) => {
            const hero = { id: 1, name: 'A' } as Hero;
            dataService.setResponse('getById', hero);
            heroCollectionService.getByKey(1).subscribe(expectDataToBe(hero, done));
        });

        it('getByKey observable should emit expected error when data service fails', (done: DoneFn) => {
            // Simulate HTTP 'Not Found' response
            const httpError = new HttpErrorResponse({
                error: 'Entity not found',
                status: 404,
                statusText: 'Not Found',
                url: 'bad/location',
            });

            // For test purposes, the following would have been effectively the same thing
            // const httpError = { error: new Error('Entity not found'), status: 404 };

            const error = makeNxaDataServiceError('GET', httpError);
            dataService.setErrorResponse('getById', error);
            heroCollectionService
                .getByKey(42)
                .subscribe(expectErrorToBe(error, done));
        });

        it('getWithQuery observable should emit heroes on success', (done: DoneFn) => {
            const hero1 = { id: 1, name: 'A' } as Hero;
            const hero2 = { id: 2, name: 'B' } as Hero;
            const heroes = [hero1, hero2];
            dataService.setResponse('getWithQuery', heroes);
            heroCollectionService
                .getWithQuery({ name: 'foo' })
                .subscribe(expectDataToBe(heroes, done));

            // reducedActions$Snoop(); // diagnostic
        });

        it('getWithQuery observable should emit expected error when data service fails', (done: DoneFn) => {
            const httpError = { error: new Error('Test Failure'), status: 501 };
            const error = makeNxaDataServiceError('GET', httpError);
            dataService.setErrorResponse('getWithQuery', error);
            heroCollectionService
                .getWithQuery({ name: 'foo' })
                .subscribe(expectErrorToBe(error, done));
        });

        it('load observable should emit heroes on success', (done: DoneFn) => {
            const hero1 = { id: 1, name: 'A' } as Hero;
            const hero2 = { id: 2, name: 'B' } as Hero;
            const heroes = [hero1, hero2];
            dataService.setResponse('getAll', heroes);
            heroCollectionService.load().subscribe(expectDataToBe(heroes, done));
        });

        it('load observable should emit expected error when data service fails', (done: DoneFn) => {
            const httpError = { error: new Error('Test Failure'), status: 501 };
            const error = makeNxaDataServiceError('GET', httpError);
            dataService.setErrorResponse('getAll', error);
            heroCollectionService.load().subscribe(expectErrorToBe(error, done));
        });
    });

    describe('cancel', () => {
        const hero1 = { id: 1, name: 'A' } as Hero;
        const hero2 = { id: 2, name: 'B' } as Hero;
        const heroes = [hero1, hero2];

        let heroCollectionService: NxaEntityCollectionService<Hero>;
        let dataService: TestDataService;
        let reducedActions$Snoop: () => void;

        beforeEach(() => {
            ({
                dataService,
                heroCollectionService,
                reducedActions$Snoop,
            } = entityServicesSetup());
        });

        it('can cancel a long running query', (done: DoneFn) => {
            const responseDelay = 4;
            dataService['getAll'].and.returnValue(
                of(heroes).pipe(delay(responseDelay))
            );

            // Create the correlation id yourself to know which action to cancel.
            const correlationId = 'CRID007';
            const options: NxaEntityActionOptions = { correlationId };
            heroCollectionService.getAll(options).subscribe(
                data => fail('should not have data but got data'),
                error => {
                    expect(error instanceof NxaPersistanceCanceled).toBe(
                        true,
                        'is NxaPersistanceCanceled'
                    );
                    expect(error.message).toBe('Test cancel');
                    done();
                }
            );

            heroCollectionService.cancel(correlationId, 'Test cancel');
        });

        it('has no effect on action with different correlationId', (done: DoneFn) => {
            const responseDelay = 4;
            dataService['getAll'].and.returnValue(
                of(heroes).pipe(delay(responseDelay))
            );

            const correlationId = 'CRID007';
            const options: NxaEntityActionOptions = { correlationId };
            heroCollectionService.getAll(options).subscribe(data => {
                expect(data).toEqual(heroes);
                done();
            }, fail);

            heroCollectionService.cancel('not-the-crid');
        });

        it('has no effect when too late', (done: DoneFn) => {
            const responseDelay = 4;
            dataService['getAll'].and.returnValue(
                of(heroes).pipe(delay(responseDelay))
            );

            const correlationId = 'CRID007';
            const options: NxaEntityActionOptions = { correlationId };
            heroCollectionService
                .getAll(options)
                .subscribe(data => expect(data).toEqual(heroes), fail);

            setTimeout(
                () => heroCollectionService.cancel(correlationId),
                responseDelay + 2
            );
            setTimeout(done, responseDelay + 4); // wait for all to complete
        });
    });

    xdescribe('saves (optimistic)', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                /* tslint:disable-next-line:no-use-before-declare */
                providers: [
                    {
                        provide: NxaEntityDispatcherDefaultOptions,
                        useClass: OptimisticDispatcherDefaultOptions,
                    },
                ],
            });
        });

        combinedSaveTests(true);
    });

    xdescribe('saves (pessimistic)', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                /* tslint:disable-next-line:no-use-before-declare */
                providers: [
                    {
                        provide: NxaEntityDispatcherDefaultOptions,
                        useClass: PessimisticDispatcherDefaultOptions,
                    },
                ],
            });
        });

        combinedSaveTests(false);
    });

    /** Save tests to be run both optimistically and pessimistically */
    function combinedSaveTests(isOptimistic: boolean) {
        let heroCollectionService: NxaEntityCollectionService<Hero>;
        let dataService: TestDataService;
        let expectOptimisticSuccess: (expect: boolean) => () => void;
        let reducedActions$Snoop: () => void;
        let successActions$: Observable<NxaEntityAction>;

        beforeEach(() => {
            ({
                dataService,
                expectOptimisticSuccess,
                heroCollectionService,
                reducedActions$Snoop,
                successActions$,
            } = entityServicesSetup());
        });

        it('add() should save a new entity and return it', (done: DoneFn) => {
            const extra = expectOptimisticSuccess(isOptimistic);
            const hero = { id: 1, name: 'A' } as Hero;
            dataService.setResponse('add', hero);
            heroCollectionService
                .add(hero)
                .subscribe(expectDataToBe(hero, done, undefined, extra));
        });

        it('add() observable should emit expected error when data service fails', (done: DoneFn) => {
            const hero = { id: 1, name: 'A' } as Hero;
            const httpError = { error: new Error('Test Failure'), status: 501 };
            const error = makeNxaDataServiceError('PUT', httpError);
            dataService.setErrorResponse('add', error);
            heroCollectionService.add(hero).subscribe(expectErrorToBe(error, done));
        });

        it('delete() should send delete for entity not in cache and return its id', (done: DoneFn) => {
            const extra = expectOptimisticSuccess(isOptimistic);
            dataService.setResponse('delete', 42);
            heroCollectionService
                .delete(42)
                .subscribe(expectDataToBe(42, done, undefined, extra));
        });

        it('delete() should skip delete for added entity cache', (done: DoneFn) => {
            // reducedActions$Snoop();
            let wasSkipped: boolean;
            successActions$.subscribe(
                (act: NxaEntityAction) => (wasSkipped = act.payload.skip === true)
            );
            const extra = () =>
                expect(wasSkipped).toBe(true, 'expected to be skipped');

            const hero = { id: 1, name: 'A' } as Hero;
            heroCollectionService.addOneToCache(hero);
            dataService.setResponse('delete', 1);
            heroCollectionService
                .delete(1)
                .subscribe(expectDataToBe(1, done, undefined, extra));
        });

        it('delete() observable should emit expected error when data service fails', (done: DoneFn) => {
            const httpError = { error: new Error('Test Failure'), status: 501 };
            const error = makeNxaDataServiceError('DELETE', httpError);
            dataService.setErrorResponse('delete', error);
            heroCollectionService.delete(42).subscribe(expectErrorToBe(error, done));
        });

        it('update() should save updated entity and return it', (done: DoneFn) => {
            const extra = expectOptimisticSuccess(isOptimistic);
            const preUpdate = { id: 1, name: 'A' } as Hero;
            heroCollectionService.addAllToCache([preUpdate]); // populate cache
            const update = { ...preUpdate, name: 'Updated A' };
            dataService.setResponse('update', null); // server returns nothing after update
            heroCollectionService
                .update(update)
                .subscribe(expectDataToBe(update, done, undefined, extra));
        });

        it('update() should save updated entity and return server-changed version', (done: DoneFn) => {
            const extra = expectOptimisticSuccess(isOptimistic);
            const preUpdate = { id: 1, name: 'A' } as Hero;
            heroCollectionService.addAllToCache([preUpdate]); // populate cache
            const update = { ...preUpdate, name: 'Updated A' };
            const postUpdate = {
                ...preUpdate,
                name: 'Updated A',
                saying: 'Server set this',
            };
            dataService.setResponse('update', postUpdate); // server returns entity with server-side changes
            heroCollectionService
                .update(update)
                .subscribe(expectDataToBe(postUpdate, done, undefined, extra));
        });

        it('update() observable should emit expected error when data service fails', (done: DoneFn) => {
            const preUpdate = { id: 1, name: 'A' } as Hero;
            heroCollectionService.addAllToCache([preUpdate]); // populate cache
            const update = { ...preUpdate, name: 'Updated A' };
            const httpError = { error: new Error('Test Failure'), status: 501 };
            const error = makeNxaDataServiceError('PUT', httpError);
            dataService.setErrorResponse('update', error);
            heroCollectionService
                .update(update)
                .subscribe(expectErrorToBe(error, done));
        });

        it('can handle out-of-order save results', (done: DoneFn) => {
            const hero1 = { id: 1, name: 'A' } as Hero;
            const hero2 = { id: 2, name: 'B' } as Hero;
            let successActionCount = 0;
            const delayMs = 5;
            let responseDelay = delayMs;
            const savedHeroes: Hero[] = [];

            successActions$.pipe(delay(1)).subscribe(act => {
                successActionCount += 1;
                if (successActionCount === 2) {
                    // Confirm hero2 actually saved before hero1
                    expect(savedHeroes).toEqual([hero2, hero1], 'savedHeroes');
                    done();
                }
            });

            // dataService.add returns odd responses later than even responses
            // so add of hero2 should complete before add of hero1
            dataService['add'].and.callFake((data: Hero) => {
                const result = of(data).pipe(
                    delay(responseDelay),
                    tap(h => savedHeroes.push(h))
                );
                responseDelay = delayMs === responseDelay ? 1 : responseDelay;
                return result;
            });

            // Save hero1 before hero2
            // Confirm that each add returns with its own hero
            heroCollectionService
                .add(hero1)
                .subscribe(data => expect(data).toEqual(hero1, 'first hero'));

            heroCollectionService
                .add(hero2)
                .subscribe(data => expect(data).toEqual(hero2, 'second hero'));
        });
    }

    describe('selectors$', () => {
        let nxaEntityActionFactory: NxaEntityActionFactory;
        let heroCollectionService: NxaEntityCollectionService<Hero>;
        let store: Store<NxaEntityCache>;

        function dispatchedAction() {
            return <NxaEntityAction>(<jasmine.Spy>store.dispatch).calls.argsFor(0)[0];
        }

        beforeEach(() => {
            const setup = entityServicesSetup();
            ({ nxaEntityActionFactory, heroCollectionService, store } = setup);
            spyOn(store, 'dispatch').and.callThrough();
        });

        it('can get collection from collection$', () => {
            const action = nxaEntityActionFactory.create('Hero', NxaEntityOp.ADD_ALL, [
                { id: 1, name: 'A' },
            ]);
            store.dispatch(action);
            heroCollectionService.collection$.subscribe(collection => {
                expect(collection.ids).toEqual([1]);
            });
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
        providers: [
            { provide: NxaEntityCacheEffects, useValue: {} },
            /* tslint:disable-next-line:no-use-before-declare */
            { provide: NxaEntityDataService, useClass: TestDataService },
            { provide: Logger, useValue: logger },
        ],
    });

    const actions$: Observable<Action> = TestBed.get(Actions);
    const dataService: TestDataService = TestBed.get(NxaEntityDataService);
    const nxaEntityActionFactory: NxaEntityActionFactory = TestBed.get(
        NxaEntityActionFactory
    );
    const entityDispatcherFactory: NxaEntityDispatcherFactory = TestBed.get(
        NxaEntityDispatcherFactory
    );
    const entityServices: NxaEntityServices = TestBed.get(NxaEntityServices);
    const heroCollectionService = entityServices.getEntityCollectionService<Hero>(
        'Hero'
    );
    const reducedActions$: Observable<Action> =
        entityDispatcherFactory.reducedActions$;
    const store: Store<NxaEntityCache> = TestBed.get(Store);
    const successActions$: Observable<NxaEntityAction> = reducedActions$.pipe(
        filter(
            (act: any) => act.payload && act.payload.entityOp.endsWith(OP_NXA_SUCCESS)
        )
    );

    /** Returns fn that confirms NxaEntityAction was (or was not Optimistic) after success */
    function expectOptimisticSuccess(expected: boolean) {
        let wasOptimistic: boolean;
        const msg = `${expected ? 'Optimistic' : 'Pessimistic'} save `;
        successActions$.subscribe(
            (act: NxaEntityAction) => (wasOptimistic = act.payload.isOptimistic === true)
        );
        return () => expect(wasOptimistic).toBe(expected, msg);
    }

    /** Snoop on reducedActions$ while debugging a test */
    function reducedActions$Snoop() {
        reducedActions$.subscribe(act => {
            console.log('scannedActions$', act);
        });
    }

    return {
        actions$,
        dataService,
        nxaEntityActionFactory,
        entityServices,
        expectOptimisticSuccess,
        heroCollectionService,
        reducedActions$,
        reducedActions$Snoop,
        store,
        successActions$,
    };
}

function expectDataToBe(
    expected: any,
    done: DoneFn,
    message?: string,
    extra?: () => void
) {
    return {
        next: (data: any) => {
            expect(data).toEqual(expected, message);
            if (extra) {
                extra(); // extra expectations before done
            }
            done();
        },
        error: fail,
    };
}

function expectErrorToBe(expected: any, done: DoneFn, message?: string) {
    return {
        next: (data: any) => {
            fail(`Expected error response but got data: '${JSON.stringify(data)}'`);
            done();
        },
        error: (error: any) => {
            expect(error).toEqual(expected, message);
            done();
        },
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

@Injectable()
export class OptimisticDispatcherDefaultOptions {
    optimisticAdd = true;
    optimisticDelete = true;
    optimisticUpdate = true;
}

@Injectable()
export class PessimisticDispatcherDefaultOptions {
    optimisticAdd = false;
    optimisticDelete = false;
    optimisticUpdate = false;
}

export interface TestDataServiceMethod {
    add: jasmine.Spy;
    delete: jasmine.Spy;
    getAll: jasmine.Spy;
    getById: jasmine.Spy;
    getWithQuery: jasmine.Spy;
    update: jasmine.Spy;
}

export class TestDataService {
    add = jasmine.createSpy('add');
    delete = jasmine.createSpy('delete');
    getAll = jasmine.createSpy('getAll');
    getById = jasmine.createSpy('getById');
    getWithQuery = jasmine.createSpy('getWithQuery');
    update = jasmine.createSpy('update');

    getService(): TestDataServiceMethod {
        return this;
    }

    setResponse(methodName: keyof TestDataServiceMethod, data: any) {
        this[methodName].and.returnValue(of(data).pipe(delay(1)));
    }

    setErrorResponse(methodName: keyof TestDataServiceMethod, error: any) {
        // Following won't quite work because delay does not appear to delay an error
        // this[methodName].and.returnValue(throwError(error).pipe(delay(1)));
        // Use timer instead
        this[methodName].and.returnValue(
            timer(1).pipe(mergeMap(() => throwError(error)))
        );
    }
}
// #endregion test helpers