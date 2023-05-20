import Vue from 'vue'
import Vuex from 'vuex'
import UserSettings from './user-settings';
import MissionAnimation from './mission-animation';

Vue.use(Vuex);

export default new Vuex.Store({

    modules: {
        UserSettings,
        MissionAnimation,
    }
});
