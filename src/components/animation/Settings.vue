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
                <span data-modal-close>&times;</span>
                <div class="modal-content"></div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import VanillaModal from 'vanilla-modal';
import store from '@/store';
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
.settings-container {
    padding: 15px;
}
.vanilla-modal .modal {
  display: block;
  position: fixed;
  content: "";
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.2s, z-index 0s 0.2s;
  text-align: center;
  overflow: hidden;
  overflow-y: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.vanilla-modal .modal > * {
  display: inline-block;
  white-space: normal;
  vertical-align: middle;
  text-align: left;
}

.vanilla-modal .modal:before {
  display: inline-block;
  overflow: hidden;
  width: 0;
  height: 100%;
  vertical-align: middle;
  content: "";
}

.vanilla-modal.modal-visible .modal {
  z-index: 99;
  opacity: 1;
  transition: opacity 0.2s;
}

.modal-inner {
  position: relative;
  overflow: hidden;
  max-width: 90%;
  max-height: 90%;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;
  z-index: -1;
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.2s, transform 0.2s, z-index 0s 0.2s;
}
.modal-visible .modal-inner {
  z-index: 100;
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.2s, transform 0.2s;
}

[data-modal-close] {
  position: absolute;
  z-index: 2;
  right: 0;
  top: 0;
  width: 25px;
  height: 25px;
  line-height: 25px;
  font-size: 13px;
  cursor: pointer;
  text-align: center;
  background: #fff;
  box-shadow: -1px 1px 2px rgba(0,0,0,0.2);
}
</style>

