import { ActionTree } from 'vuex';
import StateInterface from './state_interface';
import * as request from 'request-promise-native';

import config from '@/config';
import Trajectory from '@/models/trajectory';
import AnimationState from '@/models/animation_state';
import UserSettings from './userSettings';

const actions: ActionTree<StateInterface, StateInterface> = {

    async setUid(context, uid: string) {

        if (!uid) {
            context.commit('setUid', uid);
            context.commit('setCsvByBodyId', {});
        }
        else if (uid !== context.state.uid) {

            context.commit('setUid', uid);

            // Load settings
            await context.dispatch('loadSettings');

            // refresh results data
            await context.dispatch('getCsvResults');
        }
    },

    async getCsvResults(context) {
        window.console.log('getCsvResults() action called');
        
        const path = config.pathsUrl.replace(`{uid}`, context.state.uid);

        const options = {
            uri: `${config.BaseUrl}${path}`
        }

        const response = await request.get(options) as string;

        const data: { [id: string]: string[] } = {};
        const trajectoryByBodyId: { [id: string]: Trajectory } = {};

        let id = '';

        for (const row of response.split("\n")) {
            if (row && row.trim().length > 0) {
                if (!row.includes(',')) {
                    id = row;
                    data[id] = new Array<string>();
                } else {
                    data[id].push(row);
                }
            }
        }

        for (const bodyId in data) {
            trajectoryByBodyId[bodyId] = new Trajectory(bodyId, data[bodyId]);
        }

        context.commit('setTrajectoryByBodyId', trajectoryByBodyId);
    },

    setT(context, t: number) {
        context.commit('setT', t);
    },

    setDeltaT(context, deltaT: number) {
        context.commit('setDeltaT', deltaT);
    },

    setAnimationState(context, animationState: AnimationState) {
        context.commit('setAnimationState', animationState);
    },

    setLoading(context, loading: boolean) {
        window.console.log(`setLoading(loading: ${loading}) action called`);
        context.commit('setLoading', loading);
    },

    async setSettings(context, userSettings: UserSettings) {
        window.console.log(`setSettings`);
        window.console.log(userSettings);

        context.commit('setSettings', userSettings);
        await context.dispatch('saveSettings');
    },

    async saveSettings(context) {
        window.console.log(`Saving settings`);
        // Make sure local storage is done asynchronously

        await null;
        context.commit('userSettingsUpdatedDate');
        window.localStorage.setItem(`settings`, JSON.stringify(context.state.userSettings));
    },

    loadSettings(context) {
        window.console.log(`Load settings`);
        const settingsJson = window.localStorage.getItem(`settings`);
        if (settingsJson) {
            context.commit('setSettings', JSON.parse(settingsJson));
        }
    },

    async setPlaybackSpeed(context, playbackSpeed) {
        window.console.log(`setPlaybackSpeed(${playbackSpeed})`);
        context.commit('setPlaybackSpeed', playbackSpeed);
    }
};

export default actions;