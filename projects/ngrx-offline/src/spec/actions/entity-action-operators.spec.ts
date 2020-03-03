import { Action } from '@ngrx/store';

import { Subject } from 'rxjs';

import {
    NxaEntityAction,
    NxaEntityActionFactory,
    NxaEntityOp,
    ofNxaEntityType,
    ofNxaEntityOp,
} from '../../lib';

class Hero {
    id!: number;
    name!: string;
}

// Todo: consider marble testing
describe('NxaEntityAction Operators', () => {
    // factory never changes in these tests
    const nxaEntityActionFactory = new NxaEntityActionFactory();

    let results: any[];
    let actions: Subject<NxaEntityAction>;

    const testActions = {
        foo: <Action>{ type: 'Foo' },
        hero_query_all: nxaEntityActionFactory.create('Hero', NxaEntityOp.QUERY_ALL),
        villain_query_many: nxaEntityActionFactory.create(
            'Villain',
            NxaEntityOp.QUERY_MANY
        ),
        hero_delete: nxaEntityActionFactory.create(
            'Hero',
            NxaEntityOp.SAVE_DELETE_ONE,
            42
        ),
        bar: <Action>(<any>{ type: 'Bar', payload: 'bar' }),
    };

    function dispatchTestActions() {
        Object.keys(testActions).forEach(a => actions.next((<any>testActions)[a]));
    }

    beforeEach(() => {
        actions = new Subject<NxaEntityAction>();
        results = [];
    });

    ///////////////

    it('#ofNxaEntityType()', () => {
        // NxaEntityActions of any kind
        actions.pipe(ofNxaEntityType()).subscribe(ea => results.push(ea));

        const expectedActions = [
            testActions.hero_query_all,
            testActions.villain_query_many,
            testActions.hero_delete,
        ];
        dispatchTestActions();
        expect(results).toEqual(expectedActions);
    });

    it(`#ofNxaEntityType('SomeType')`, () => {
        // NxaEntityActions of one type
        actions.pipe(ofNxaEntityType('Hero')).subscribe(ea => results.push(ea));

        const expectedActions = [
            testActions.hero_query_all,
            testActions.hero_delete,
        ];
        dispatchTestActions();
        expect(results).toEqual(expectedActions);
    });

    it(`#ofNxaEntityType('Type1', 'Type2', 'Type3')`, () => {
        // n.b. 'Bar' is not an EntityType even though it is an action type
        actions
            .pipe(ofNxaEntityType('Hero', 'Villain', 'Bar'))
            .subscribe(ea => results.push(ea));

        ofNxaEntityTypeTest();
    });

    it('#ofNxaEntityType(...arrayOfTypeNames)', () => {
        const types = ['Hero', 'Villain', 'Bar'];

        actions.pipe(ofNxaEntityType(...types)).subscribe(ea => results.push(ea));
        ofNxaEntityTypeTest();
    });

    it('#ofNxaEntityType(arrayOfTypeNames)', () => {
        const types = ['Hero', 'Villain', 'Bar'];

        actions.pipe(ofNxaEntityType(types)).subscribe(ea => results.push(ea));
        ofNxaEntityTypeTest();
    });

    function ofNxaEntityTypeTest() {
        const expectedActions = [
            testActions.hero_query_all,
            testActions.villain_query_many,
            testActions.hero_delete,
            // testActions.bar, // 'Bar' is not an EntityType
        ];
        dispatchTestActions();
        expect(results).toEqual(expectedActions);
    }

    it('#ofNxaEntityType(...) is case sensitive', () => {
        // NxaEntityActions of the 'hero' type, but it's lowercase so shouldn't match
        actions.pipe(ofNxaEntityType('hero')).subscribe(ea => results.push(ea));

        dispatchTestActions();
        expect(results).toEqual([], 'should not match anything');
    });

    ///////////////

    it('#ofNxaEntityOp with string args', () => {
        actions
            .pipe(ofNxaEntityOp(NxaEntityOp.QUERY_ALL, NxaEntityOp.QUERY_MANY))
            .subscribe(ea => results.push(ea));

        ofNxaEntityOpTest();
    });

    it('#ofNxaEntityOp with ...rest args', () => {
        const ops = [NxaEntityOp.QUERY_ALL, NxaEntityOp.QUERY_MANY];

        actions.pipe(ofNxaEntityOp(...ops)).subscribe(ea => results.push(ea));
        ofNxaEntityOpTest();
    });

    it('#ofNxaEntityOp with array args', () => {
        const ops = [NxaEntityOp.QUERY_ALL, NxaEntityOp.QUERY_MANY];

        actions.pipe(ofNxaEntityOp(ops)).subscribe(ea => results.push(ea));
        ofNxaEntityOpTest();
    });

    it('#ofNxaEntityOp()', () => {
        // NxaEntityOps of any kind
        actions.pipe(ofNxaEntityOp()).subscribe(ea => results.push(ea));

        const expectedActions = [
            testActions.hero_query_all,
            testActions.villain_query_many,
            testActions.hero_delete,
        ];
        dispatchTestActions();
        expect(results).toEqual(expectedActions);
    });

    function ofNxaEntityOpTest() {
        const expectedActions = [
            testActions.hero_query_all,
            testActions.villain_query_many,
        ];
        dispatchTestActions();
        expect(results).toEqual(expectedActions);
    }
});