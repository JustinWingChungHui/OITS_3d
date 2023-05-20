
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import Trajectory from '@/models/trajectory';
import AnimationState from '@/models/animation_state';
import config from '@/config';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import store from '@/store';

@Module({ namespaced: true })
class MissionAnimation extends VuexModule {

    public resultsUrl = '';
    public TrajectoryByBodyId: { [id: string]: Trajectory } = {};
    public t = 0;
    public deltaT = 1;
    public AnimationState = AnimationState.paused;
    public Loading = true;
    public PlaybackSpeed = 1;

    // Brightness
    public light = 3.2;
    public lastUpdatedDate = new Date();

    public get tDate(): Date {
        return new Date((config.ZeroDate + this.t) * 1000);
    }

    public get IsAnimating(): boolean { 
        return this.AnimationState === AnimationState.playing;
    }

    public get BackgroundPath(): string {
        return config.backgrounds[store.state.UserSettings.Data.background];
    }


    @Mutation
    public SetResultsUrl(url: string) {
        window.console.log(`SetResultsUrl(${url}) mutation called`);
        this.resultsUrl = url;
    }

    @Mutation
    public SetTrajectoryByBodyId(trajectoryByBodyId: { [id: string]: Trajectory }) {
        window.console.log('setTrajectoryByBodyId() mutation called');
        this.TrajectoryByBodyId = trajectoryByBodyId;
    }

    @Mutation
    public SetT(t: number) {
        this.t = t;
    }

    @Mutation
    public SetDeltaT(deltaT: number) {
        this.deltaT = deltaT;
    }

    @Mutation
    public SetAnimationState(animationState: AnimationState) {
        window.console.log(`SetAnimationState(animationState: ${animationState}) mutation called`);
        this.AnimationState = animationState;
    }

    @Mutation
    public SetLoading(loading: boolean) {
        this.Loading = loading;
    }

    @Mutation
    public SetPlaybackSpeed(playbackSpeed: number) {
        this.PlaybackSpeed = playbackSpeed;
    }

    @Action({ rawError: true })
    public async UpdateResultsUrl(url: string) {
        window.console.log(`UpdateResultsUrl(url: ${url}) action called`);

        this.context.commit('SetResultsUrl', url);

        if (!url) {
            this.context.commit('SetTrajectoryByBodyId', {});
        }
        else {
            // Load settings
            await store.dispatch('UserSettings/Load');

            // refresh results data
            await this.context.dispatch('GetCsvResults');
        }
    }

    @Action({ rawError: true })
    public async GetCsvResults() {
        window.console.log('GetCsvResults() action called');

        const response = await axios.get(this.resultsUrl) as AxiosResponse<string>;

        const data: { [id: string]: string[] } = {};
        const trajectoryByBodyId: { [id: string]: Trajectory } = {};

        let id = '';

        for (const row of response.data.split("\n")) {
            if (row && row.trim().length > 0) {
                if (!row.includes(',')) {
                    id = row.trim();
                    data[id] = new Array<string>();
                } else {
                    data[id].push(row);
                }
            }
        }

        for (const bodyId in data) {
            trajectoryByBodyId[bodyId] = new Trajectory(bodyId, data[bodyId]);
        }

        this.context.commit('SetTrajectoryByBodyId', trajectoryByBodyId);
    }

    @Action
    public UpdateT(t: number) {
        this.context.commit('SetT', t);
    }

    @Action
    public UpdateDeltaT(deltaT: number) {
        this.context.commit('SetDeltaT', deltaT);
    }

    @Action
    public UpdateAnimationState(animationState: AnimationState) {
        this.context.commit('SetAnimationState', animationState);
    }

    @Action
    public UpdateLoading(loading: boolean) {
        window.console.log(`UpdateLoading(loading: ${loading}) action called`);
        this.context.commit('SetLoading', loading);
    }

    @Action
    public async UpdatePlaybackSpeed(playbackSpeed: number) {
        window.console.log(`UpdatePlaybackSpeed(${playbackSpeed})`);
        this.context.commit('SetPlaybackSpeed', playbackSpeed);
    }
}

export default MissionAnimation



