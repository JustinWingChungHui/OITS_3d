
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import Trajectory from '@/models/trajectory';
import AnimationState from '@/models/animation_state';
import config from '@/config';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import store from '@/store';

@Module({ namespaced: true })
class MissionAnimation extends VuexModule {

    public id = 0;
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
    public SetId(id: number) {
        window.console.log(`SetId(${id}) mutation called`);
        this.id = id;
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
    public async UpdateId(id: number) {
        window.console.log(`UpdateId(uid: ${id}) action called`);

        this.context.commit('SetId', id);

        if (!id) {
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
        
        const path = config.pathsUrl.replace(`{id}`, this.id.toString());
        const url = `${config.BaseUrl}${path}`;

        const response = await axios.get(url) as AxiosResponse<string>;

        const data: { [id: string]: string[] } = {};
        const trajectoryByBodyId: { [id: string]: Trajectory } = {};

        let id = '';

        for (const row of response.data.split("\n")) {
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



