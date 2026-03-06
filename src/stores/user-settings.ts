import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import config from '@/config';

export interface UserSettingValues {
    background: string;
    probeSizeMultiple: number;
    bodySizeMultiple: number;
    markerSizeMultiple: number;
    asteroidSizeMultiple: number;
    planetTrajectoryColor: string;
    probeTrajectoryColor: string;
    probeColor: string;
    asteroidTrajectoryColor: string;
    markerColor: string;
    cameraTracksProbe: boolean;
}

export const useUserSettingsStore = defineStore('user-settings', () => {
    const data = ref<UserSettingValues>({
        background: 'Milky Way',
        probeSizeMultiple: 10,
        bodySizeMultiple: 10,
        markerSizeMultiple: 10,
        asteroidSizeMultiple: 1,
        planetTrajectoryColor: 'blue',
        probeTrajectoryColor: 'white',
        asteroidTrajectoryColor: 'red',
        probeColor: 'white',
        markerColor: 'green',
        cameraTracksProbe: true
    });

    const LastUpdatedDate = ref(new Date());

    const BackgroundPath = computed<string>(() => {
      return config.backgrounds[data.value.background]!;
    })

    const Save = () => {
        console.log(`Saving settings`);
        // Make sure local storage is done asynchronously

        LastUpdatedDate.value = new Date();
        window.localStorage.setItem(`settings`, JSON.stringify(data.value));
    }

    const Load = () => {
        console.log(`Load settings`);
        const settingsJson = window.localStorage.getItem(`settings`);
        if (settingsJson) {
            data.value = JSON.parse(settingsJson);
        }
    }

    return {
        data,
        Save,
        Load,
        LastUpdatedDate,
        BackgroundPath
    }
})