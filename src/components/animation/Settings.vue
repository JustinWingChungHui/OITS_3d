<template>
    <div>
        <div id="settingsModal" style="display:none">
            <div class="settings-container">
                <h2>Settings</h2>
                <div class="pure-form pure-form-aligned">
                    <fieldset>
                       <div class="pure-control-group">
                            <label>Background</label>
                            <select v-model="settingsData.background">
                                <option v-for="(item, key) in backgrounds" :key="key">{{key}}</option>
                            </select>
                        </div>
                        <div class="pure-control-group">
                            <label>Planet Trajectory Colour</label>
                            <select v-model="settingsData.planetTrajectoryColor">
                                <option v-for="colour in colours" :key="colour">
                                    {{colour}}
                                </option>
                            </select>
                        </div>
                        <div class="pure-control-group">
                            <label>Probe Colour</label>
                            <select v-model="settingsData.probeColor">
                                <option v-for="colour in colours" :key="colour">
                                    {{colour}}
                                </option>
                            </select>
                        </div>
                        <div class="pure-control-group">
                            <label>Probe Trajectory Colour</label>
                            <select v-model="settingsData.probeTrajectoryColor">
                                <option v-for="colour in colours" :key="colour">
                                    {{colour}}
                                </option>
                            </select>
                        </div>
                        <div class="pure-control-group">
                            <label>Marker Colour</label>
                            <select v-model="settingsData.markerColor">
                                <option v-for="colour in colours" :key="colour">
                                    {{colour}}
                                </option>
                            </select>
                        </div>
                        <div class="pure-control-group">
                            <label>Asteroid Trajectory Colour</label>
                            <select v-model="settingsData.asteroidTrajectoryColor">
                                <option v-for="colour in colours" :key="colour">
                                    {{colour}}
                                </option>
                            </select>
                        </div>
                        <div class="pure-control-group">
                            <label>Body Size</label>
                            <input type="number" v-model="settingsData.bodySizeMultiple" />
                        </div>
                        <div class="pure-control-group">
                            <label>Probe Size</label>
                            <input type="number" v-model="settingsData.probeSizeMultiple" />
                        </div>
                        <div class="pure-control-group">
                            <label>Marker Size</label>
                            <input type="number" v-model="settingsData.markerSizeMultiple" />
                        </div>
                        <div class="pure-control-group">
                            <label>Asteroid Size</label>
                            <input type="number" v-model="settingsData.asteroidSizeMultiple" />
                        </div>
                        <div class="pure-control-group">
                            <label>Camera Tracks Probe</label>
                            <input type="checkbox" v-model="settingsData.cameraTracksProbe" />
                        </div>
                        <div class="pure-controls">
                             <button class="pure-button pure-button-primary" @click="save">Save</button>
                        </div>
                    </fieldset>
                </div>
            </div>
        </div>
        <div class="modal">
            <div class="modal-inner">
                <span data-modal-close class="oi" data-glyph="x"></span>
                <div class="modal-content"></div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import VanillaModal from 'vanilla-modal';
import UserSettingValues from '@/store/user-setting-values';
import config from '@/config';
const UserSettings = namespace('UserSettings');


@Component
export default class Settings extends Vue {

    public modal?: VanillaModal;

    public colours: Array<string> = [
        'blue',
        'red',
        'white',
        'green',
        'yellow',
        'pink',
        'orange',
        'magenta',
        'lime',
        'aqua',
        'black',
        'grey',
        'purple',
    ];

    public get backgrounds(): { [id: string]: string } {
        return config.backgrounds;
    }

    public settingsData: UserSettingValues = {
        background: 'white',
        probeSizeMultiple: 10,
        bodySizeMultiple: 10,
        markerSizeMultiple: 10,
        asteroidSizeMultiple: 10,
        planetTrajectoryColor: 'blue',
        probeTrajectoryColor: 'white',
        asteroidTrajectoryColor: 'red',
        probeColor: 'white',
        markerColor: 'green',
        cameraTracksProbe: true,
    };

    @UserSettings.State
    public Data!: UserSettingValues;

    @UserSettings.Action
    public Update!: (userSettings: UserSettingValues) => Promise<void>;

    @UserSettings.Action
    public Load!: () => void;

    protected mounted() {
        window.console.log(`Settings mounted()`);
        this.Load();

        window.console.log(this.Data);
        this.settingsData = this.Data;
    }

    public show() {
        window.console.log(`show()`);
        this.modal = new VanillaModal();
        window.console.log(`this.modal.open('#settingsModal');`);
        this.modal.open('#settingsModal');
    }

    public async save() {
        await this.Update(this.settingsData);
        if (this.modal) {
            this.modal.close();
        }
    }
}

</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../../css/modal.css';

.settings-container {
    padding: 15px;
}

</style>

