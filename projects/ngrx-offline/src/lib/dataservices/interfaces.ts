import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';

/** A service that performs REST-like HTTP data operations for an entity collection */
export interface NxaEntityCollectionDataService<T> {
    readonly name: string;
    add(entity: T): Observable<T>;
    delete(id: number | string): Observable<number | string>;
    getAll(): Observable<T[]>;
    getById(id: any): Observable<T>;
    getWithQuery(params: NxaQueryParams | string): Observable<T[]>;
    update(update: Update<T>): Observable<T>;
    upsert(entity: T): Observable<T>;
}

export type NxaHttpMethods = 'DELETE' | 'GET' | 'POST' | 'PUT';

export interface NxaRequestData {
    method: NxaHttpMethods;
    url: string;
    data?: any;
    options?: any;
}

/**
 * A key/value map of parameters to be turned into an HTTP query string
 * Same as HttpClient's HttpParamsOptions which is NOT exported at package level
 * https://github.com/angular/angular/issues/22013
 */
export interface NxaQueryParams {
    [name: string]: string | string[];
}