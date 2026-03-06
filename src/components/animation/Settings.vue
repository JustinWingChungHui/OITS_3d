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
                                <option v-for="(item, key) in config.backgrounds" :key="key">{{key}}</option>
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
                             <button class="pure-button pure-button-primary" @click="emit('close')">Close</button>
                        </div>
                    </fieldset>
                </div>
            </div>
        </div>
        <div class="modal">
            <div class="modal-inner">
                <div class="modal-content"></div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import VanillaModal from 'vanilla-modal';
import { useUserSettingsStore, type UserSettingValues } from '@/stores/user-settings';
import config from '@/config';

const userSettingsStore = useUserSettingsStore();

const { modalOpen} = defineProps<{
    modalOpen: boolean
}>();

const emit =defineEmits<{
    (e: 'close'): void
}>();

const modal = ref<VanillaModal>();

const colours: Array<string> = [
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
    

const settingsData = ref<UserSettingValues>({
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
});

onMounted(() => {
    console.log(`Settings mounted()`);
    userSettingsStore.Load();

    settingsData.value = {...userSettingsStore.data};
    modal.value = new VanillaModal({
        clickOutside: false
    });
})

onBeforeUnmount(() => {
    modal.value?.destroy();
})

const show = () => {
    console.log(`show()`);
    console.log(`this.modal.open('#settingsModal');`);
    modal.value!.open('#settingsModal');
}

watch(() => modalOpen, async (newValue) => {
    console.log(`watch modalOpen: ${newValue}`);
    if (newValue) {
        show();
    } else {
        userSettingsStore.data = {...settingsData.value};
        await userSettingsStore.Save();
        if (modal.value) {
            modal.value.close();
        }
    }
})

</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../../css/modal.css';

.settings-container {
    padding: 15px;
}

</style>

