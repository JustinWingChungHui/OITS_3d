import { GetterTree } from 'vuex';
import StateInterface from './state_interface';
import config from '@/config';

const getters: GetterTree<StateInterface, StateInterface> = {
    tDate: (state): Date => new Date((config.ZeroDate + state.t) * 1000),
};

export default getters;