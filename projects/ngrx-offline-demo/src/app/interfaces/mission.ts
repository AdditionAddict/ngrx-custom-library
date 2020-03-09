export interface Mission {
    uuid: string
    name: string
    celestialBody: string
    launchDate: string
}

export interface MissionDetail extends Mission {
    description: string
    launchSite: string
    mass: number
}