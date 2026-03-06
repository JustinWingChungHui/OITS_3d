<template>
  <div id="container"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, onBeforeUnmount } from 'vue';
import SceneBuilder from '@/models/scene_builders/scene-builder';
import { MissionState } from '@/models/missions/mission_state';
import { useUserSettingsStore } from '@/stores/user-settings';
import { useLoadingStateStore } from '@/stores/loading-state';

const userSettingsStore = useUserSettingsStore();
const loadingStateStore = useLoadingStateStore();

const { urlBase64 } =defineProps<{
  urlBase64?: string;
}>()

let scene: SceneBuilder | null = null;
let initialising = false;

onMounted(async () => {
  initialising = true;
  await init();
  initialising = false;
})

onBeforeUnmount(() => {
  console.log(`Scene.beforeUnmount()`);
  scene?.dispose();
})

const init = async () => {
  console.log(`Scene.init()`);

  loadingStateStore.loading = true;

  const container = document.getElementById('container');

  if (urlBase64 && container) {

    try {
      await MissionState.UpdateResultsUrl(atob(urlBase64));
      const height = window.innerHeight - container.getBoundingClientRect().top - 100;
      container.style.height = `${height}px`;
      await buildScene(container);
    
    } catch(ex) {
      console.log(ex);
      window.alert('Error occured loading data');
    }
  }
}

const buildScene = async (container: HTMLElement) => {
  console.log(`Scene.buildScene()`);
  loadingStateStore.loading = true;
  scene = new SceneBuilder(container);
  await scene.load()
  loadingStateStore.loading = false;
  scene.animate(); 
}

watch(() =>userSettingsStore.LastUpdatedDate, async (newValue, oldValue) => {
  console.log(`watch settingsLastUpdatedDate: ${oldValue} -> ${newValue}`)
  if (newValue > oldValue && !initialising) {
    scene?.dispose();
    const container = document.getElementById('container') as HTMLElement;
    container.innerHTML = '';
    await buildScene(container);
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #container {
    width: 100%;
    height: 100%;
  }
</style>
