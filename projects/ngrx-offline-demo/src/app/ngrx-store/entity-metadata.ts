import { NxaEntityMetadataMap } from 'ngrx-offline';


export function selectIdMission(mission) {
    return mission.uuid;
}


export const entityMetadata: NxaEntityMetadataMap = {
    Mission: {
        selectId: selectIdMission
    },
    MissionDetail: {},
    CelestialBody: {}
};