import { UpdateStr, UpdateNum, Update } from '@ngrx/entity/src/models';
import { NxaChangeType } from '../reducers/entity-collection';
import { Observable } from 'rxjs';
import { NxaQueryParams } from '../dataservices/interfaces';

export interface ChangeTypeLogged<T> {
    changeType?: NxaChangeType;
    originalValue?: T;
}
export type Changed<T> = T & ChangeTypeLogged<T>;

export interface UpdatedStr<T> extends UpdateStr<T> {
    originalValue: T;
}
export interface UpdatedNum<T> extends UpdateNum<T> {
    originalValue: T;
}
export type Updated<T> = UpdatedStr<T> | UpdatedNum<T>;

/** A service that performs offline operations for an entity collection */
export interface NxaEntityCollectionOfflineService<T> {
    readonly name: string;
    add(entity: T): Observable<T>;
    delete(id: number | string): Observable<number | string>
    getAll(): Observable<T[]>;
    getById(id: any): Observable<T>;
    getWithQuery(params: NxaQueryParams | string): Observable<T[]>;
    update(update: Update<T>): Observable<T>;
    upsert(entity: T): Observable<T>;
}