import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NxaEntityMetadataMap, NXA_ENTITY_METADATA_TOKEN } from '../../lib/entity-metadata/entity-metadata';
import { NxaEntityDefinitionService } from '../../lib/entity-metadata/entity-definition.service';
import { createNxaEntityDefinition } from '../../lib/entity-metadata/entity-definition';

@NgModule({})
class LazyModule {
    lazyMetadataMap = {
        Sidekick: {},
    };

    constructor(entityDefinitionService: NxaEntityDefinitionService) {
        entityDefinitionService.registerMetadataMap(this.lazyMetadataMap);
    }
}

describe('NxaEntityDefinitionService', () => {
    let service: NxaEntityDefinitionService;
    let metadataMap: NxaEntityMetadataMap;

    beforeEach(() => {
        metadataMap = {
            Hero: {},
            Villain: {},
        };

        TestBed.configureTestingModule({
            // Not actually lazy but demonstrates a module that registers metadata
            imports: [LazyModule],
            providers: [
                NxaEntityDefinitionService,
                { provide: NXA_ENTITY_METADATA_TOKEN, multi: true, useValue: metadataMap },
            ],
        });
        service = TestBed.get(NxaEntityDefinitionService);
    });

    describe('#getDefinition', () => {
        it('returns definition for known entity', () => {
            const def = service.getDefinition('Hero');
            expect(def).toBeDefined();
        });

        it('throws if request definition for unknown entity', () => {
            expect(() => service.getDefinition('Foo')).toThrowError(/No NxaEntityDefinition for entity type "Foo"/i);
        });

        it('returns undefined if request definition for unknown entity and `shouldThrow` is false', () => {
            const def = service.getDefinition('foo', /* shouldThrow */ false);
            expect(def).not.toBeDefined();
        });
    });

    describe('#registerMetadata(Map)', () => {
        it('can register a new definition by metadata', () => {
            service.registerMetadata({ entityName: 'Foo' });

            let def = service.getDefinition('Foo');
            expect(def).toBeDefined();
            // Hero is still defined after registering Foo
            def = service.getDefinition('Hero');
            expect(def).toBeDefined('Hero still defined');
        });

        it('can register new definitions by metadata map', () => {
            service.registerMetadataMap({
                Foo: {},
                Bar: {},
            });

            let def = service.getDefinition('Foo');
            expect(def).toBeDefined('Foo');
            def = service.getDefinition('Bar');
            expect(def).toBeDefined('Bar');
            def = service.getDefinition('Hero');
            expect(def).toBeDefined('Hero still defined');
        });

        it('entityName property should trump map key', () => {
            service.registerMetadataMap({
                1: { entityName: 'Foo' }, // key and entityName differ
            });

            let def = service.getDefinition('Foo');
            expect(def).toBeDefined('Foo');
            def = service.getDefinition('Hero');
            expect(def).toBeDefined('Hero still defined');
        });

        it('a (lazy-loaded) module can register metadata with its constructor', () => {
            // The `Sidekick` metadata are registered by LazyModule's ctor
            // Although LazyModule is actually eagerly-loaded in this test,
            // the registration technique is the important thing.
            const def = service.getDefinition('Sidekick');
            expect(def).toBeDefined('Sidekick');
        });
    });

    describe('#registerDefinition(s)', () => {
        it('can register a new definition', () => {
            const newDef = createNxaEntityDefinition({ entityName: 'Foo' });
            service.registerDefinition(newDef);

            let def = service.getDefinition('Foo');
            expect(def).toBeDefined();
            // Hero is still defined after registering Foo
            def = service.getDefinition('Hero');
            expect(def).toBeDefined('Hero still defined');
        });

        it('can register a map of several definitions', () => {
            const newDefMap = {
                Foo: createNxaEntityDefinition({ entityName: 'Foo' }),
                Bar: createNxaEntityDefinition({ entityName: 'Bar' }),
            };
            service.registerDefinitions(newDefMap);

            let def = service.getDefinition('Foo');
            expect(def).toBeDefined('Foo');
            def = service.getDefinition('Bar');
            expect(def).toBeDefined('Bar');
            def = service.getDefinition('Hero');
            expect(def).toBeDefined('Hero still defined');
        });

        it('can re-register an existing definition', () => {
            const testSelectId = (entity: any) => 'test-id';
            const newDef = createNxaEntityDefinition({
                entityName: 'Hero',
                selectId: testSelectId,
            });
            service.registerDefinition(newDef);

            const def = service.getDefinition('Hero');
            expect(def).toBeDefined('Hero still defined');
            expect(def.selectId).toBe(testSelectId, 'updated w/ new selectId');
        });
    });
});