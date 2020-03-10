import { Injectable } from '@angular/core';
import {
    NxaEntityCollectionServiceBase,
    NxaEntityCollectionServiceElementsFactory
} from 'ngrx-offline';
import { MissionDetail } from '../../interfaces';

@Injectable({ providedIn: 'root' })
export class MissionDetailCollectionService extends NxaEntityCollectionServiceBase<MissionDetail> {
    constructor(serviceElementsFactory: NxaEntityCollectionServiceElementsFactory) {
        super('MissionDetail', serviceElementsFactory);
    }
}