
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

//https://bezkoder.com/vuex-typescript-jwt-auth/


import UserSettingValues from './user-setting-values';

@Module({ namespaced: true })
class UserSettings extends VuexModule {

    public Data: UserSettingValues = {
        background: 'Milky Way',
        probeSizeMultiple: 10,
        bodySizeMultiple: 10,
        markerSizeMultiple: 10,
        asteroidSizeMultiple: 10,
        planetTrajectoryColor: 'blue',
        probeTrajectoryColor: 'white',
        asteroidTrajectoryColor: 'red',
        probeColor: 'white',
        markerColor: 'green',
        cameraTracksProbe: true
    };

    // Brightness
    public LastUpdatedDate = new Date();

    @Mutation
    public Set(settings: UserSettingValues) {
        this.Data.background = settings.background ?? 'Milky Way';
        this.Data.probeSizeMultiple = settings.probeSizeMultiple ?? 10;
        this.Data.bodySizeMultiple = settings.bodySizeMultiple ?? 10;
        this.Data.markerSizeMultiple = settings.markerSizeMultiple ?? 10;
        this.Data.asteroidSizeMultiple = settings.asteroidSizeMultiple ?? 10;
        this.Data.planetTrajectoryColor = settings.planetTrajectoryColor ?? 'blue';
        this.Data.asteroidTrajectoryColor = settings.asteroidTrajectoryColor ?? 'red';
        this.Data.probeColor = settings.probeColor ?? 'white';
        this.Data.markerColor = settings.markerColor ?? 'green';
        this.Data.cameraTracksProbe = settings.cameraTracksProbe ?? true;
    }

    @Mutation
    public UpdateDate() {
        this.LastUpdatedDate = new Date();
    }

    @Action({ rawError: true })
    public async Update(userSettings: UserSettingValues) {

        this.context.commit('Set', userSettings);
        await this.context.dispatch('Save');
    }

    @Action({ rawError: true })
    public async Save() {
        window.console.log(`Saving settings`);
        // Make sure local storage is done asynchronously

        await null;
        this.context.commit('UpdateDate');
        window.localStorage.setItem(`settings`, JSON.stringify(this.Data));
    }

    @Action({ rawError: true })
    public Load() {
        window.console.log(`Load settings`);
        const settingsJson = window.localStorage.getItem(`settings`);
        if (settingsJson) {
            this.context.commit('Set', JSON.parse(settingsJson));
        }
    }
}

export default UserSettings



