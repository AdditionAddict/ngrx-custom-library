import { NgModule, Optional } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Update } from '@ngrx/entity';

import { NxaEntityCollectionDataService, NxaQueryParams } from '../../lib/dataservices/interfaces';
import { NxaEntityDataService } from '../../lib/dataservices/entity-data.service';
import { NxaHttpUrlGenerator, NxaEntityHttpResourceUrls } from '../../lib/dataservices/http-url-generator';
import { NxaDefaultDataServiceFactory, NxaDefaultDataService } from '../../lib/dataservices/default-data.service';

// region Test Helpers
///// Test Helpers /////

export class CustomDataService {
    name: string;
    constructor(name: string) {
        this.name = name + ' CustomDataService';
    }
}

export class Bazinga {
    id!: number;
    wow!: string;
}

export class BazingaDataService
    implements NxaEntityCollectionDataService<Bazinga> {
    name: string;

    // TestBed bug requires `@Optional` even though http is always provided.
    constructor(@Optional() private http: HttpClient) {
        if (!http) {
            throw new Error('Where is HttpClient?');
        }
        this.name = 'Bazinga custom data service';
    }

    add(entity: Bazinga): Observable<Bazinga> {
        return this.bazinga();
    }
    delete(id: any): Observable<number | string> {
        return this.bazinga();
    }
    getAll(): Observable<Bazinga[]> {
        return this.bazinga();
    }
    getById(id: any): Observable<Bazinga> {
        return this.bazinga();
    }
    getWithQuery(params: string | NxaQueryParams): Observable<Bazinga[]> {
        return this.bazinga();
    }
    update(update: Update<Bazinga>): Observable<Bazinga> {
        return this.bazinga();
    }
    upsert(entity: Bazinga): Observable<Bazinga> {
        return this.bazinga();
    }

    private bazinga(): any {
        bazingaFail();
        return undefined;
    }
}

@NgModule({
    providers: [BazingaDataService],
})
export class CustomDataServiceModule {
    constructor(
        entityDataService: NxaEntityDataService,
        bazingaService: BazingaDataService
    ) {
        entityDataService.registerService('Bazinga', bazingaService);
    }
}

function bazingaFail() {
    throw new Error('Bazinga! This method is not implemented.');
}

/** Test version always returns canned Hero resource base URLs  */
class TestNxaHttpUrlGenerator implements NxaHttpUrlGenerator {
    entityResource(entityName: string, root: string): string {
        return 'api/hero/';
    }
    collectionResource(entityName: string, root: string): string {
        return 'api/heroes/';
    }
    registerHttpResourceUrls(
        entityHttpResourceUrls: NxaEntityHttpResourceUrls
    ): void { }
}

// endregion

///// Tests begin ////

// failing tests
// TODO: fix

xdescribe('NxaEntityDataService', () => {
    const nullHttp = {};
    let entityDataService: NxaEntityDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CustomDataServiceModule],
            providers: [
                NxaDefaultDataServiceFactory,
                NxaEntityDataService,
                { provide: HttpClient, useValue: nullHttp },
                { provide: NxaHttpUrlGenerator, useClass: TestNxaHttpUrlGenerator },
            ],
        });
        entityDataService = TestBed.get(NxaEntityDataService);
    });

    describe('#getService', () => {
        it('can create a data service for "Hero" entity', () => {
            const service = entityDataService.getService('Hero');
            expect(service).toBeDefined();
        });

        it('data service should be a NxaDefaultDataService by default', () => {
            const service = entityDataService.getService('Hero');
            expect(service instanceof NxaDefaultDataService).toBe(true);
        });

        it('gets the same service every time you ask for it', () => {
            const service1 = entityDataService.getService('Hero');
            const service2 = entityDataService.getService('Hero');
            expect(service1).toBe(service2);
        });
    });

    describe('#register...', () => {
        it('can register a custom service for "Hero"', () => {
            const customService: any = new CustomDataService('Hero');
            entityDataService.registerService('Hero', customService);

            const service = entityDataService.getService('Hero');
            expect(service).toBe(customService);
        });

        it('can register multiple custom services at the same time', () => {
            const customHeroService: any = new CustomDataService('Hero');
            const customVillainService: any = new CustomDataService('Villain');
            entityDataService.registerServices({
                Hero: customHeroService,
                Villain: customVillainService,
            });

            let service = entityDataService.getService('Hero');
            expect(service).toBe(customHeroService, 'custom Hero data service');
            expect(service.name).toBe('Hero CustomDataService');

            service = entityDataService.getService('Villain');
            expect(service).toBe(customVillainService, 'custom Villain data service');

            // Other services are still NxaDefaultDataServices
            service = entityDataService.getService('Foo');
            expect(service.name).toBe('Foo NxaDefaultDataService');
        });

        it('can register a custom service using a module import', () => {
            const service = entityDataService.getService('Bazinga');
            expect(service instanceof BazingaDataService).toBe(true);
        });
    });
});