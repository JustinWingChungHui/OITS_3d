<template>
  <div id="container"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SceneBuilder from '../scene_builders/scene-builder';
import store from '@/store';

@Component
export default class Scene extends Vue {

  private scene: SceneBuilder | null = null;

  protected async mounted() {
    await this.init();
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
      this.scene = new SceneBuilder(container);
      await this.scene.load()

      store.dispatch('setLoading', false);
      this.scene.animate(); 
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
