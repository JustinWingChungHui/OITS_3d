
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import config from '@/config';
import store from '@/store';
import router from '@/router';
import Mission from '@/models/missions/mission';
import MissionParams from '@/models/missions/mission_params';
import BodyStage from '@/models/missions/body_stage';
import IntermediatePointStage from '@/models/missions/intermediate_point_stage';
import axios from 'axios';
import { AxiosResponse } from 'axios';

@Module({ namespaced: true })
class Missions extends VuexModule {

    public static ChangeableStatuses = ['N', 'P', 'A'];

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

    @Mutation
    public SetBodyStage(bodyStage: BodyStage) {
        const mission = this.Mission?.objectParameters;
        if (mission && mission.Periacon.length > bodyStage.StageIndex) {
            mission.ID[bodyStage.StageIndex] = bodyStage.ID;
            mission.Periacon[bodyStage.StageIndex] = bodyStage.Periacon;
            mission.dVcon[bodyStage.StageIndex] = bodyStage.dVcon;
            mission.tmax[bodyStage.StageIndex] = bodyStage.tmax;
            mission.t0[bodyStage.StageIndex] = bodyStage.t0;
            mission.tmin[bodyStage.StageIndex] = bodyStage.tmin;

            if (bodyStage.StageIndex > 0) {
                mission.Perihcon[bodyStage.StageIndex - 1] = bodyStage.Perihcon;
            }
        }
    }
    
    @Mutation
    public SetIntermediatePointStage(ips: IntermediatePointStage) {
        const mission = this.Mission?.objectParameters;
        if (mission && mission.rIP.length > ips.intermediatePointIndex) {
            mission.rIP[ips.intermediatePointIndex] = ips.rIP;
            mission.thetaIP[ips.intermediatePointIndex] = ips.thetaIP;
            mission.thetalb[ips.intermediatePointIndex] = ips.thetalb;
            mission.thetaub[ips.intermediatePointIndex] = ips.thetaub;
            mission.thiIP[ips.intermediatePointIndex] = ips.thiIP;
            mission.thilb[ips.intermediatePointIndex] = ips.thilb;
            mission.thiub[ips.intermediatePointIndex] = ips.thiub;
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
    public async GetMissionStatusUpdate(pk: number) {
        const uri = `${config.BaseUrl}${config.missionsUrl}${pk}/`;

        const response = await axios.get(uri) as AxiosResponse<Mission>;

        const missions = this.Missions.map(m => {
            if (m.id === response.data?.id) {
                return response.data
            } else {
                return m;
            }
        });
        
        this.context.commit('SetMissions', missions);
    }

    @Action({ rawError: true })
    public EnableMissionUpdates() {
        for (const mission of this.Missions) {
            if (Missions.ChangeableStatuses.includes(mission.status)) {
                this.context.dispatch('GetMissionUpdate', mission.id);
            }
        }
    }

    @Action({ rawError: true })
    public async GetMissionUpdate(pk: number) {
        await this.context.dispatch('GetMissionStatusUpdate', pk);

        const mission = this.Missions.find(m => m.id === pk);

        if (mission && Missions.ChangeableStatuses.includes(mission.status)) {
            window.setTimeout(async() => {
                if (this.missionUpdatesEnabled) {
                    await this.context.dispatch('GetMissionUpdate', pk);
                }
            }, 5000);
        }
    }

    @Action({ rawError: true })
    public async PostSelectedMission() {

        store.dispatch('MissionAnimation/UpdateLoading', true);
        const uri = `${config.BaseUrl}${config.missionsUrl}`;

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
            mission.tmax.push(365);
            mission.t0.push(180);
            mission.tmin.push(1);
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

    @Action({ rawError: true })
    public UpdateBodyStage(bodyStage: BodyStage) {
        this.context.commit('SetBodyStage', bodyStage);
    }

    @Action({ rawError: true })
    public UpdateIntermediatePointStage(intermediatePointStage: IntermediatePointStage) {
        this.context.commit('SetIntermediatePointStage', intermediatePointStage);
    }

    @Action({ rawError: true })
    public async DeleteMission(pk: number) {
        window.console.log('DeleteMission() action called');
        const uri = `${config.BaseUrl}${config.missionsUrl}${pk}/`;
        await axios.delete(uri) as AxiosResponse<Mission>;

        await store.dispatch('Missions/GetMissions', false);
    }

    @Action({ rawError: true })
    public async CancelMission(pk: number) {
        window.console.log('DeleteMission() action called');
        const uri = `${config.BaseUrl}${config.missionsUrl}${pk}/cancel/`;
        await axios.post(uri) as AxiosResponse<Mission>;

        await store.dispatch('Missions/GetMissions', false);
    }

    
}

export default Missions



