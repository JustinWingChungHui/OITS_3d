
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import config from '@/config';
import store from '@/store';
import Mission from '@/models/missions/mission';
import axios from 'axios';
import { AxiosResponse } from 'axios';

@Module({ namespaced: true })
class Missions extends VuexModule {

    public Loading = true;

    public Mission?: Mission;
    public Missions: Mission[] = [];

    @Mutation
    public SetMissions(mission: Mission[]) {
        this.Missions = mission;
    }

    @Mutation
    public SetMission(mission: Mission) {
        this.Mission = mission;
    }

    @Action({ rawError: true })
    public async GetMissions() {
        window.console.log('GetMissions() action called');
        store.dispatch('MissionAnimation/UpdateLoading', true);

        const uri = `${config.BaseUrl}${config.missionsUrl}`;

        const response = await axios.get(uri) as AxiosResponse<Mission[]>;
        window.console.log('MissionResponse');
        window.console.log(response);
        this.context.commit('SetMissions', response.data);

        store.dispatch('MissionAnimation/UpdateLoading', false);
    }

    @Action({ rawError: true })
    public async GetMission(pk: number) {
        const uri = `${config.BaseUrl}${config.missionsUrl}${pk}/`;

        const response = await axios.get(uri) as AxiosResponse<Mission>;
        this.context.commit('SetMission', response.data);
    }
}

export default Missions



