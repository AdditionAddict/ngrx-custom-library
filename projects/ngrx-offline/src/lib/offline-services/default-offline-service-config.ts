

/**
 * Optional configuration settings for an entity collection offline service
 * such as the `NxaDefaultOfflineService<T>`.
 * TODO: merge configs?
 */
export abstract class NxaDefaultOfflineServiceConfig {
    /**
     * Indexeddb name
     */
    dbName?: string
    dbVersion?: number
    idbConfig?: { [key: string]: { keyPath: string } }
}