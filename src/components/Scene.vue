<template>
  <div id="container"></div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import SceneBuilder from '../scene_builders/scene-builder';
import store from '@/store';

@Component
export default class Scene extends Vue {

  private scene: SceneBuilder | null = null;

  private initialising = false;

  private get settingsLastUpdatedDate(): Date {
    return store.state.userSettings.lastUpdatedDate;
  }

  protected async mounted() {
    this.initialising = true;
    await this.init();
    this.initialising = false;
  }

  private async init() {
    console.log(`Scene.init()`);
    store.dispatch('setLoading', true);
    const uid = this.$route.query.uid;
    console.log(`uid: ${uid}`);
    const container = document.getElementById('container');

    if (uid && container) {
      const height = window.innerHeight - container.getBoundingClientRect().top - 200;
      container.style.height = `${height}px`;
      await store.dispatch('setUid', uid)
      await this.buildScene(container);
    }
  }

  private async buildScene(container: HTMLElement) {
    store.dispatch('setLoading', true);
    this.scene = new SceneBuilder(container);
    await this.scene.load()

    store.dispatch('setLoading', false);
    this.scene.animate(); 
  }

  @Watch('settingsLastUpdatedDate')
  private async onsettingsLastUpdatedDateChanged(newValue: Date, oldValue: Date) {
    window.console.log(`onsettingsLastUpdatedDateChanged(${oldValue}, ${newValue}`)
    if (newValue > oldValue && !this.initialising) {

      if (this.scene) {
        this.scene.dispose();
      }

      const container = document.getElementById('container') as HTMLElement;
      container.innerHTML = '';
      await this.buildScene(container);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #container {
    width: 100%;
    height: 100%;
  }
</style>
