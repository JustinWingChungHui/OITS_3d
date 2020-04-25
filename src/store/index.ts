import Vue from 'vue'
import Vuex from 'vuex'
import StateInterface from './state_interface';
import State from './state';
import Getters from './getters';
import Mutations from './mutations';
import Actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store<StateInterface>({
    state: State,
    getters: Getters,
    mutations: Mutations,
    actions: Actions,
});
