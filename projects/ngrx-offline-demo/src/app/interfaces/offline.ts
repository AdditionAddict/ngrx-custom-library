import { NxaEntityOp } from 'ngrx-offline'

/**
 * Offline patterns - not used
 * 
 * https://medium.com/offline-camp/offline-patterns-there-are-many-jobs-to-be-done-9f97f7e89304
 * 
 */

export interface Freshness {
    lastEdited: string
    lastViewed: string
}

type ReachState = 'reachable' | 'unreachable' | 'unknown'

export interface Reach {
    url: string,
    reach: ReachState
}

type AssuranceState = 'Unsaved' | 'Syncing' | 'Synced' | 'Edited'

/**
 * Unchanged => selectors
 * Unsaved => selectors
 * Syncing => maintain separate ngrx-offline state
 */

export interface SyncState {
    syncing: boolean
    // synced: boolean => derivable, zero unsaved

}

export interface Assurance {
    entityName: string,
    entityOp: NxaEntityOp,
    entityID: number | string,
    assurance: AssuranceState
}