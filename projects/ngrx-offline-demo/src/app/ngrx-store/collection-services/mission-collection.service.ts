import { Injectable } from '@angular/core';
import {
    NxaEntityCollectionServiceBase,
    NxaEntityCollectionServiceElementsFactory
} from 'ngrx-offline';
import { Mission } from '../../interfaces';

@Injectable({ providedIn: 'root' })
export class MissionCollectionService extends NxaEntityCollectionServiceBase<Mission> {
    constructor(serviceElementsFactory: NxaEntityCollectionServiceElementsFactory) {
        super('Mission', serviceElementsFactory);
    }
}