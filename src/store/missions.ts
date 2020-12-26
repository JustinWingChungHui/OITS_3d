
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

        if(this.Mission.description !== this.Mission.objectParameters?.description) {
            this.Mission.objectParameters.description = this.Mission.description;
        }
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

    @Action({ rawError: true })
    public async PostSelectedMission() {

        store.dispatch('MissionAnimation/UpdateLoading', true);
        const uri = `${config.BaseUrl}${config.missionsUrl}/`;

        await axios.post(uri, this.Mission?.objectParameters) as AxiosResponse<Mission>;

        store.dispatch('MissionAnimation/UpdateLoading', false);
    }

    @Action({ rawError: true })
    public AddStageToSelectedMission() {
        if (this.Mission?.objectParameters) {
            const mission = this.Mission?.objectParameters
            mission.ID.push('3'); // Default to Earth
            mission.Periacon.push(0);
            mission.Perihcon.push(0);
            mission.dVcon.push(0);
            mission.tmax.push(0);
            mission.t0.push(0);
            mission.tmin.push(0);
        }
    }

    @Action({ rawError: true })
    public RemoveLastStageFromSelectedMission() {
        if (this.Mission?.objectParameters) {
            const mission = this.Mission?.objectParameters
            mission.ID.pop();
            mission.Periacon.pop();
            mission.Perihcon.pop();
            mission.dVcon.pop();
            mission.tmax.pop();
            mission.t0.pop();
            mission.tmin.pop();
        }
    }
}

export default Missions



