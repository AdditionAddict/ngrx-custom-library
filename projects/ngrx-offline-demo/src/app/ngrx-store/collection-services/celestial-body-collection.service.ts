import { Injectable } from '@angular/core';
import {
    NxaEntityCollectionServiceBase,
    NxaEntityCollectionServiceElementsFactory
} from 'ngrx-offline';
import { CelestialBody } from '../../interfaces';

@Injectable({ providedIn: 'root' })
export class CelestialBodyCollectionService extends NxaEntityCollectionServiceBase<CelestialBody> {
    constructor(serviceElementsFactory: NxaEntityCollectionServiceElementsFactory) {
        super('CelestialBody', serviceElementsFactory);
    }
}