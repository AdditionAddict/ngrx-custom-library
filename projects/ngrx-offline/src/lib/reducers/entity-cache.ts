import { NxaEntityCollection } from './entity-collection';

export interface NxaEntityCache {
    // Must be `any` since we don't know what type of collections we will have
    [name: string]: NxaEntityCollection<any>;
}