import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    NxaDefaultDataService,
    NxaHttpUrlGenerator,
    Logger
} from 'ngrx-offline';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Mission } from '../../interfaces';
import { hardCodedMissions } from './mission.data';

@Injectable()
export class MissionDataService extends NxaDefaultDataService<Mission> {
    private many$: BehaviorSubject<Mission[]> = new BehaviorSubject(hardCodedMissions);


    constructor(http: HttpClient, httpUrlGenerator: NxaHttpUrlGenerator, logger: Logger) {
        super('Mission', http, httpUrlGenerator);
        logger.log('Created custom Mission EntityDataService');
    }

    getAll(): Observable<Mission[]> {
        return this.many$.asObservable().pipe(map(this.deepCopy.bind(this)));
    }

    getById(id: string | number): Observable<Mission> {
        return this.many$.pipe(
            map(missions => {
                const mission = missions.find(m => m.uuid === id);
                if (!mission) {
                    throw new Error('not found');
                }
                return mission;
            }),
            map(this.deepCopy.bind(this))
        );
    }

    private deepCopy(data: Mission[]): Mission[] {
        return JSON.parse(JSON.stringify(data));
    }

}