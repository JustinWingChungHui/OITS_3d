
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import config from '@/config';
import * as request from 'request-promise-native';
import store from '@/store';
import { MissionResponse } from '@/models/missions/missions_response';
import axios from 'axios';
import { AxiosResponse } from 'axios';

@Module({ namespaced: true })
class Missions extends VuexModule {

    public Loading = true;

    public Missions: MissionResponse[] = [];

    @Mutation
    public SetMissions(missions: MissionResponse[]) {
        this.Missions = missions;
    }

    @Action({ rawError: true })
    public async GetMissions() {
        window.console.log('GetMissions() action called');
        store.dispatch('MissionAnimation/UpdateLoading', true);

        const options = {
            uri: `${config.BaseUrl}${config.missionsUrl}`,
            json: true
        }

        const response = await axios.get(`${config.BaseUrl}${config.missionsUrl}`) as AxiosResponse<MissionResponse[]>;
        window.console.log('MissionResponse');
        window.console.log(response);
        this.context.commit('SetMissions', response.data);

        store.dispatch('MissionAnimation/UpdateLoading', false);
    }

 
}

export default Missions



