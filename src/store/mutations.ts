import { MutationTree } from 'vuex';
import StateInterface from './state_interface';
import Trajectory from '@/models/trajectory';
import AnimationState from '@/models/animation_state';

const mutations: MutationTree<StateInterface> = {

    setUid(state, uid: string) {
        window.console.log(`setUid(${uid}) mutation called`);
        state.uid = uid;
    },

    setTrajectoryByBodyId(state, trajectoryByBodyId: { [id: string]: Trajectory }) {
        window.console.log('setTrajectoryByBodyId() mutation called');
        state.TrajectoryByBodyId = trajectoryByBodyId;
    },


    setT(state, t: number) {
        state.t = t;
    },

    setDeltaT(state, deltaT: number) {
        state.deltaT = deltaT;
    },

    setAnimationState(state, animationState: AnimationState) {
        state.animationState = animationState;
    },

    setLoading(state, loading: boolean) {
        state.loading = loading;
    }
};

export default mutations;