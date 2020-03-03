import { NxaEntityActionFactory } from "../../lib/actions/entity-action-factory";
import { NxaEntityOp } from '../../lib/actions/entity-op';
import { NxaEntityActionOptions, NxaEntityActionPayload } from '../../lib/actions/entity-action';
import { NxaMergeStrategy } from '../../lib/actions/merge-strategy';


class Hero {
    id!: number;
    name!: string;
}

describe('NxaEntityActionFactory', () => {
    let factory: NxaEntityActionFactory;

    beforeEach(() => {
        factory = new NxaEntityActionFactory();
    });

    it('#create should create an NxaEntityAction from entityName and entityOp', () => {
        const action = factory.create('Hero', NxaEntityOp.QUERY_ALL);
        const { entityName, entityOp, data } = action.payload;
        expect(entityName).toBe('Hero');
        expect(entityOp).toBe(NxaEntityOp.QUERY_ALL);
        expect(data).toBeUndefined('no data property');
    });

    it('#create should create an NxaEntityAction with the given data', () => {
        const hero: Hero = { id: 42, name: 'Francis' };
        const action = factory.create('Hero', NxaEntityOp.ADD_ONE, hero);
        const { entityName, entityOp, data } = action.payload;
        expect(entityName).toBe('Hero');
        expect(entityOp).toBe(NxaEntityOp.ADD_ONE);
        expect(data).toBe(hero);
    });

    it('#create should create an NxaEntityAction with options', () => {
        const options: NxaEntityActionOptions = {
            correlationId: 'CRID42',
            isOptimistic: true,
            mergeStrategy: NxaMergeStrategy.OverwriteChanges,
            tag: 'Foo',
        };

        // Don't forget placeholder for missing optional data!
        const action = factory.create(
            'Hero',
            NxaEntityOp.QUERY_ALL,
            undefined,
            options
        );
        const {
            entityName,
            entityOp,
            data,
            correlationId,
            isOptimistic,
            mergeStrategy,
            tag,
        } = action.payload;
        expect(entityName).toBe('Hero');
        expect(entityOp).toBe(NxaEntityOp.QUERY_ALL);
        expect(data).toBeUndefined();
        expect(correlationId).toBe(options.correlationId);
        expect(isOptimistic).toBe(options.isOptimistic);
        expect(mergeStrategy).toBe(options.mergeStrategy);
        expect(tag).toBe(options.tag);
    });

    it('#create create an NxaEntityAction from an NxaEntityActionPayload', () => {
        const hero: Hero = { id: 42, name: 'Francis' };
        const payload: NxaEntityActionPayload = {
            entityName: 'Hero',
            entityOp: NxaEntityOp.ADD_ONE,
            data: hero,
            correlationId: 'CRID42',
            isOptimistic: true,
            mergeStrategy: NxaMergeStrategy.OverwriteChanges,
            tag: 'Foo',
        };
        const action = factory.create(payload);

        const {
            entityName,
            entityOp,
            data,
            correlationId,
            isOptimistic,
            mergeStrategy,
            tag,
        } = action.payload;
        expect(entityName).toBe(payload.entityName);
        expect(entityOp).toBe(payload.entityOp);
        expect(data).toBe(payload.data);
        expect(correlationId).toBe(payload.correlationId);
        expect(isOptimistic).toBe(payload.isOptimistic);
        expect(mergeStrategy).toBe(payload.mergeStrategy);
        expect(tag).toBe(payload.tag);
    });

    it('#createFromAction should create NxaEntityAction from another NxaEntityAction', () => {
        // pessimistic save
        const hero1: Hero = { id: undefined as any, name: 'Francis' };
        const action1 = factory.create('Hero', NxaEntityOp.SAVE_ADD_ONE, hero1);

        // after save succeeds
        const hero: Hero = { ...hero1, id: 42 };
        const action = factory.createFromAction(action1, {
            entityOp: NxaEntityOp.SAVE_ADD_ONE_SUCCESS,
            data: hero,
        });
        const { entityName, entityOp, data } = action.payload;

        expect(entityName).toBe('Hero');
        expect(entityOp).toBe(NxaEntityOp.SAVE_ADD_ONE_SUCCESS);
        expect(data).toBe(hero);
        const expectedType = factory.formatActionType(
            NxaEntityOp.SAVE_ADD_ONE_SUCCESS,
            'Hero'
        );
        expect(action.type).toEqual(expectedType);
    });

    it('#createFromAction should copy the options from the source action', () => {
        const options: NxaEntityActionOptions = {
            correlationId: 'CRID42',
            isOptimistic: true,
            mergeStrategy: NxaMergeStrategy.OverwriteChanges,
            tag: 'Foo',
        };
        // Don't forget placeholder for missing optional data!
        const sourceAction = factory.create(
            'Hero',
            NxaEntityOp.QUERY_ALL,
            undefined,
            options
        );

        const queryResults: Hero[] = [
            { id: 1, name: 'Francis' },
            { id: 2, name: 'Alex' },
        ];
        const action = factory.createFromAction(sourceAction, {
            entityOp: NxaEntityOp.QUERY_ALL_SUCCESS,
            data: queryResults,
        });

        const {
            entityName,
            entityOp,
            data,
            correlationId,
            isOptimistic,
            mergeStrategy,
            tag,
        } = action.payload;
        expect(entityName).toBe('Hero');
        expect(entityOp).toBe(NxaEntityOp.QUERY_ALL_SUCCESS);
        expect(data).toBe(queryResults);
        expect(correlationId).toBe(options.correlationId);
        expect(isOptimistic).toBe(options.isOptimistic);
        expect(mergeStrategy).toBe(options.mergeStrategy);
        expect(tag).toBe(options.tag);
    });

    it('#createFromAction can suppress the data property', () => {
        const hero: Hero = { id: 42, name: 'Francis' };
        const action1 = factory.create('Hero', NxaEntityOp.ADD_ONE, hero);
        const action = factory.createFromAction(action1, {
            entityOp: NxaEntityOp.SAVE_ADD_ONE,
            data: undefined,
        });
        const { entityName, entityOp, data } = action.payload;
        expect(entityName).toBe('Hero');
        expect(entityOp).toBe(NxaEntityOp.SAVE_ADD_ONE);
        expect(data).toBeUndefined();
    });

    it('#formatActionType should format type with the entityName', () => {
        const action = factory.create('Hero', NxaEntityOp.QUERY_ALL);
        const expectedFormat = factory.formatActionType(NxaEntityOp.QUERY_ALL, 'Hero');
        expect(action.type).toBe(expectedFormat);
    });

    it('#formatActionType should format type with given tag instead of the entity name', () => {
        const tag = 'Hero - Tag Test';
        const action = factory.create('Hero', NxaEntityOp.QUERY_ALL, null, { tag });
        expect(action.type).toContain(tag);
    });

    it('can re-format generated action.type with a custom #formatActionType()', () => {
        factory.formatActionType = (op, entityName) =>
            `${entityName}_${op}`.toUpperCase();

        const expected = ('Hero_' + NxaEntityOp.QUERY_ALL).toUpperCase();
        const action = factory.create('Hero', NxaEntityOp.QUERY_ALL);
        expect(action.type).toBe(expected);
    });

    it('should throw if do not specify entityName', () => {
        expect(() => factory.create(null as any)).toThrow();
    });

    it('should throw if do not specify NxaEntityOp', () => {
        expect(() =>
            factory.create({ entityName: 'Hero', entityOp: null as any })
        ).toThrow();
    });
});