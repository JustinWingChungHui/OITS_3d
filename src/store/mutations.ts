import { MutationTree } from 'vuex';
import StateInterface from './state_interface';

const mutations: MutationTree<StateInterface> = {

    setUid(state, uid: string) {
        window.console.log(`setUid(${uid}) mutation called`);
        state.uid = uid;
    },

    setCsvByBodyId(state, csvByBodyId: { [id: string]: string[] }) {
        window.console.log('setCsvByBodyId() mutation called');
        state.CsvByBodyId = csvByBodyId;
    },

    setT(state, t: number) {
        state.t = t;
    },

    setDeltaT(state, deltaT: number) {
        state.deltaT = deltaT;
    }
};

export default mutations;