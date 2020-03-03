// Not using marble testing
import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { observeOn } from 'rxjs/operators';
import { asapScheduler, ReplaySubject, Subject } from 'rxjs';

import {
    NxaEntityCacheEffects,
    NxaEntityActionFactory,
    NxaEntityCacheDataService,
    NxaSaveEntities,
    NxaSaveEntitiesSuccess,
    NxaSaveEntitiesCancel,
    NxaSaveEntitiesCanceled,
    NxaSaveEntitiesError,
    NxaHttpMethods,
    NxaDataServiceError,
    NxaChangeSet,
    NxaChangeSetItem,
    NxaChangeSetOperation,
    Logger,
    NxaMergeStrategy,
} from '../../lib';

describe('NxaEntityCacheEffects (normal testing)', () => {
    let actions$: ReplaySubject<Action>;
    let correlationId: string;
    let dataService: TestNxaEntityCacheDataService;
    let effects: NxaEntityCacheEffects;
    let logger: Logger;
    let mergeStrategy: NxaMergeStrategy | undefined;
    let options: {
        correlationId: typeof correlationId;
        mergeStrategy: typeof mergeStrategy;
    };

    function expectCompletion(completion: any, done: DoneFn) {
        effects.NxaSaveEntities$.subscribe(result => {
            expect(result).toEqual(completion);
            done();
        }, fail);
    }

    beforeEach(() => {
        actions$ = new ReplaySubject<Action>(1);
        correlationId = 'CORID42';
        logger = jasmine.createSpyObj('Logger', ['error', 'log', 'warn']);
        mergeStrategy = undefined;
        options = { correlationId, mergeStrategy };

        const eaFactory = new NxaEntityActionFactory(); // doesn't change.

        TestBed.configureTestingModule({
            providers: [
                NxaEntityCacheEffects,
                { provide: NxaEntityActionFactory, useValue: eaFactory },
                { provide: Actions, useValue: actions$ },
                /* tslint:disable-next-line:no-use-before-declare */
                {
                    provide: NxaEntityCacheDataService,
                    useClass: TestNxaEntityCacheDataService,
                },
                { provide: Logger, useValue: logger },
            ],
        });

        actions$ = TestBed.get(Actions);
        effects = TestBed.get(NxaEntityCacheEffects);
        dataService = TestBed.get(NxaEntityCacheDataService);
    });

    it('should return a SAVE_ENTITIES_SUCCESS with the expected NxaChangeSet on success', (done: DoneFn) => {
        const cs = createNxaChangeSet();
        const action = new NxaSaveEntities(cs, 'test/save', options);
        const completion = new NxaSaveEntitiesSuccess(cs, 'test/save', options);

        expectCompletion(completion, done);

        actions$.next(action);
        dataService.setResponse(cs);
    });

    it('should not emit SAVE_ENTITIES_SUCCESS if cancel arrives in time', (done: DoneFn) => {
        const cs = createNxaChangeSet();
        const action = new NxaSaveEntities(cs, 'test/save', options);
        const cancel = new NxaSaveEntitiesCancel(correlationId, 'Test Cancel');

        effects.NxaSaveEntities$.subscribe(result => {
            expect(result instanceof NxaSaveEntitiesSuccess).toBe(false);
            expect(result instanceof NxaSaveEntitiesCanceled).toBe(true); // instead
            done();
        }, done.fail);

        actions$.next(action);
        actions$.next(cancel);
        dataService.setResponse(cs);
    });

    it('should emit SAVE_ENTITIES_SUCCESS if cancel arrives too late', (done: DoneFn) => {
        const cs = createNxaChangeSet();
        const action = new NxaSaveEntities(cs, 'test/save', options);
        const cancel = new NxaSaveEntitiesCancel(correlationId, 'Test Cancel');

        effects.NxaSaveEntities$.subscribe(result => {
            expect(result instanceof NxaSaveEntitiesSuccess).toBe(true);
            done();
        }, done.fail);

        actions$.next(action);
        dataService.setResponse(cs);
        setTimeout(() => actions$.next(cancel), 1);
    });

    it('should emit SAVE_ENTITIES_SUCCESS immediately if no changes to save', (done: DoneFn) => {
        const action = new NxaSaveEntities({ changes: [] }, 'test/save', options);
        effects.NxaSaveEntities$.subscribe(result => {
            expect(result instanceof NxaSaveEntitiesSuccess).toBe(true);
            expect(dataService.NxaSaveEntities).not.toHaveBeenCalled();
            done();
        }, done.fail);
        actions$.next(action);
    });

    xit('should return a SAVE_ENTITIES_ERROR when data service fails', (done: DoneFn) => {
        const cs = createNxaChangeSet();
        const action = new NxaSaveEntities(cs, 'test/save', options);
        const httpError = { error: new Error('Test Failure'), status: 501 };
        const error = makeNxaDataServiceError('POST', httpError);
        const completion = new NxaSaveEntitiesError(error, action);

        expectCompletion(completion, done);

        actions$.next(action);
        dataService.setErrorResponse(error);
    });
});

// #region test helpers
export class TestNxaEntityCacheDataService {
    response$ = new Subject<any>();

    NxaSaveEntities = jasmine
        .createSpy('NxaSaveEntities')
        .and.returnValue(this.response$.pipe(observeOn(asapScheduler)));

    setResponse(data: any) {
        this.response$.next(data);
    }

    setErrorResponse(error: any) {
        this.response$.error(error);
    }
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
    let url = 'test/save';
    if (httpError) {
        url = httpError.url || url;
    } else {
        httpError = { error: new Error('Test error'), status: 500, url };
    }
    return new NxaDataServiceError(httpError, { method, url, options });
}

function createNxaChangeSet(): NxaChangeSet {
    const changes: NxaChangeSetItem[] = [
        {
            op: NxaChangeSetOperation.Add,
            entityName: 'Hero',
            entities: [{ id: 1, name: 'A1 Add' }],
        },
        {
            op: NxaChangeSetOperation.Delete,
            entityName: 'Hero',
            entities: [2, 3],
        },
        {
            op: NxaChangeSetOperation.Update,
            entityName: 'Villain',
            entities: [
                { id: 4, changes: { id: 4, name: 'V4 Update' } },
                { id: 5, changes: { id: 5, name: 'V5 Update' } },
                { id: 6, changes: { id: 6, name: 'V6 Update' } },
            ],
        },
        {
            op: NxaChangeSetOperation.Upsert,
            entityName: 'Villain',
            entities: [
                { id: 7, name: 'V7 Upsert new' },
                { id: 4, name: 'V4 Upsert existing' },
            ],
        },
    ];

    return {
        changes,
        extras: { foo: 'anything' },
        tag: 'Test',
    };
}
// #endregion test helpers