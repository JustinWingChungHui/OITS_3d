import Trajectory from '@/models/trajectory';
import AnimationState from '@/models/animation_state';
import config from '@/config';
import { useUserSettingsStore } from '@/stores/user-settings';
import axios from 'axios';

interface IMissionState {
    resultsUrl: string;
    trajectoryByBodyId: { [id: string]: Trajectory };
    t: number;
    deltaT: number;
    animationState: AnimationState;
    playbackSpeed: number;
    distanceFromSun: number;
    probeSpeed: number | null;
    distanceFromEarth: number;
    light: number;
    lastUpdatedDate: Date;
    tDate: () => Date;
    IsAnimating: () => boolean;
    UpdateResultsUrl: (url: string) => Promise<void>;
    GetCsvResults: () => Promise<void>;
}

// This can't be a pinia store because the performance hit from making it a store is too high. It needs to be a simple object that can be imported and used directly.
export const MissionState: IMissionState = {
    resultsUrl: '',
    trajectoryByBodyId: {} as { [id: string]: Trajectory },
    t: 0,
    deltaT: 1,
    animationState: AnimationState.paused,
    playbackSpeed: 1,
    distanceFromSun: 0,
    probeSpeed: 0,
    distanceFromEarth: 0,
    light: 3.2,
    lastUpdatedDate: new Date(),
    tDate: (): Date => {
        return new Date((config.ZeroDate + MissionState.t) * 1000);
    },
    IsAnimating: (): boolean => {
        return MissionState.animationState === AnimationState.playing;
    },
    UpdateResultsUrl: async (url: string) => {
        console.log(`UpdateResultsUrl(url: ${url}) action called`);
        MissionState.resultsUrl = url;

        if (!url) {
            MissionState.trajectoryByBodyId = {};
        }
        else {
            // Load settings
             const userSettingsStore = useUserSettingsStore();
             userSettingsStore.Load();

            // refresh results data
            await MissionState.GetCsvResults();
        }
    },
    GetCsvResults: async () => {
        console.log('GetCsvResults() action called');
        const response = await axios.get<string>(MissionState.resultsUrl);
        const data: { [id: string]: string[] } = {};
        const trajByBodyId: { [id: string]: Trajectory } = {};
    
        let id = '';
    
        for (const row of response.data.split("\n")) {
            if (row && row.trim().length > 0) {
                if (!row.includes(',')) {
                    id = row.trim();
                    data[id] = [];
                } else {
                    data[id]!.push(row);
                }
            }
        }
    
        for (const bodyId in data) {
            trajByBodyId[bodyId] = new Trajectory(bodyId, data[bodyId]!);
        }
    
        MissionState.trajectoryByBodyId = trajByBodyId;
    }
}