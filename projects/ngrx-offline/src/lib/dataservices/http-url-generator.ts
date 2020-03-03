import { Injectable } from '@angular/core';
import { Pluralizer } from '../utils/interfaces';

/**
 * Known resource URLS for specific entity types.
 * Each entity's resource URLS are endpoints that
 * target single entity and multi-entity HTTP operations.
 * Used by the `NxaDefaultHttpUrlGenerator`.
 */
export abstract class NxaEntityHttpResourceUrls {
    [entityName: string]: NxaHttpResourceUrls;
}

/**
 * Resource URLS for HTTP operations that target single entity
 * and multi-entity endpoints.
 */
export interface NxaHttpResourceUrls {
    /**
     * The URL path for a single entity endpoint, e.g, `some-api-root/hero/`
     * such as you'd use to add a hero.
     * Example: `httpClient.post<Hero>('some-api-root/hero/', addedHero)`.
     * Note trailing slash (/).
     */
    entityResourceUrl: string;
    /**
     * The URL path for a multiple-entity endpoint, e.g, `some-api-root/heroes/`
     * such as you'd use when getting all heroes.
     * Example: `httpClient.get<Hero[]>('some-api-root/heroes/')`
     * Note trailing slash (/).
     */
    collectionResourceUrl: string;
}

/**
 * Generate the base part of an HTTP URL for
 * single entity or entity collection resource
 */
export abstract class NxaHttpUrlGenerator {
    /**
     * Return the base URL for a single entity resource,
     * e.g., the base URL to get a single hero by its id
     */
    abstract entityResource(entityName: string, root: string): string;

    /**
     * Return the base URL for a collection resource,
     * e.g., the base URL to get all heroes
     */
    abstract collectionResource(entityName: string, root: string): string;

    /**
     * Register known single-entity and collection resource URLs for HTTP calls
     * @param entityNxaHttpResourceUrls {NxaEntityHttpResourceUrls} resource urls for specific entity type names
     */
    abstract registerHttpResourceUrls(
        entityHttpResourceUrls?: NxaEntityHttpResourceUrls
    ): void;
}

@Injectable()
export class NxaDefaultHttpUrlGenerator implements NxaHttpUrlGenerator {
    /**
     * Known single-entity and collection resource URLs for HTTP calls.
     * Generator methods returns these resource URLs for a given entity type name.
     * If the resources for an entity type name are not know, it generates
     * and caches a resource name for future use
     */
    protected knownHttpResourceUrls: NxaEntityHttpResourceUrls = {};

    constructor(private pluralizer: Pluralizer) { }

    /**
     * Get or generate the entity and collection resource URLs for the given entity type name
     * @param entityName {string} Name of the entity type, e.g, 'Hero'
     * @param root {string} Root path to the resource, e.g., 'some-api`
     */
    protected getResourceUrls(
        entityName: string,
        root: string
    ): NxaHttpResourceUrls {
        let resourceUrls = this.knownHttpResourceUrls[entityName];
        if (!resourceUrls) {
            const nRoot = NxaNormalizeRoot(root);
            resourceUrls = {
                entityResourceUrl: `${nRoot}/${entityName}/`.toLowerCase(),
                collectionResourceUrl: `${nRoot}/${this.pluralizer.pluralize(
                    entityName
                )}/`.toLowerCase(),
            };
            this.registerHttpResourceUrls({ [entityName]: resourceUrls });
        }
        return resourceUrls;
    }

    /**
     * Create the path to a single entity resource
     * @param entityName {string} Name of the entity type, e.g, 'Hero'
     * @param root {string} Root path to the resource, e.g., 'some-api`
     * @returns complete path to resource, e.g, 'some-api/hero'
     */
    entityResource(entityName: string, root: string): string {
        return this.getResourceUrls(entityName, root).entityResourceUrl;
    }

    /**
     * Create the path to a multiple entity (collection) resource
     * @param entityName {string} Name of the entity type, e.g, 'Hero'
     * @param root {string} Root path to the resource, e.g., 'some-api`
     * @returns complete path to resource, e.g, 'some-api/heroes'
     */
    collectionResource(entityName: string, root: string): string {
        return this.getResourceUrls(entityName, root).collectionResourceUrl;
    }

    /**
     * Register known single-entity and collection resource URLs for HTTP calls
     * @param entityNxaHttpResourceUrls {NxaEntityHttpResourceUrls} resource urls for specific entity type names
     * Well-formed resource urls end in a '/';
     * Note: this method does not ensure that resource urls are well-formed.
     */
    registerHttpResourceUrls(
        entityHttpResourceUrls: NxaEntityHttpResourceUrls
    ): void {
        this.knownHttpResourceUrls = {
            ...this.knownHttpResourceUrls,
            ...(entityHttpResourceUrls || {}),
        };
    }
}

/** Remove leading & trailing spaces or slashes */
export function NxaNormalizeRoot(root: string) {
    return root.replace(/^[\/\s]+|[\/\s]+$/g, '');
}