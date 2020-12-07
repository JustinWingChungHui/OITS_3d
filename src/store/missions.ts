
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import config from '@/config';
import store from '@/store';
import router from '@/router';
import Mission from '@/models/missions/mission';
import MissionParams from '@/models/missions/mission_params';
import axios from 'axios';
import { AxiosResponse } from 'axios';

@Module({ namespaced: true })
class Missions extends VuexModule {

    public Loading = true;

    public Mission?: Mission;
    public Missions: Mission[] = [];

    public get missionUpdatesEnabled(): boolean {
        return router.currentRoute.name === 'Home';
    }

    @Mutation
    public SetMissions(missions: Mission[]) {
        this.Missions = missions;
    }

    @Mutation
    public SetMission(mission: Mission) {
        this.Mission = mission;
        this.Mission.objectParameters = JSON.parse(mission.parameters) as MissionParams;
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

        const missions = this.Missions.map(m => {
            if (m.id === this.Mission?.id) {
                return this.Mission
            } else {
                return m;
            }
        });
        
        this.context.commit('SetMissions', missions);
    }

    @Action({ rawError: true })
    public EnableMissionUpdates() {
        for (const mission of this.Missions) {
            if (mission.status !== 'C') {
                this.context.dispatch('GetMissionUpdate', mission.id);
            }
        }
    }

    @Action({ rawError: true })
    public async GetMissionUpdate(pk: number) {
        await this.context.dispatch('GetMission', pk);
        window.setTimeout(async() => {
            if (this.missionUpdatesEnabled) {
                await this.context.dispatch('GetMissionUpdate', pk);
            }
        }, 5000);
    }
}

export default Missions



