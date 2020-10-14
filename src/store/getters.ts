import { GetterTree } from 'vuex';
import StateInterface from './state_interface';
import config from '@/config';
import AnimationState from '@/models/animation_state';

const getters: GetterTree<StateInterface, StateInterface> = {

    tDate: (state): Date => new Date((config.ZeroDate + state.t) * 1000),

    isAnimating: (state): boolean => state.animationState === AnimationState.playing,

    backgroundPath: (state): string => config.backgrounds[state.userSettings.background],
};

export default getters;