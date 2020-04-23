<template>
  <div id="container"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SceneBuilder from '../scene_builders/scene-builder';

@Component
export default class Scene extends Vue {

  private scene: SceneBuilder | null = null;

  protected async mounted() {
    await this.init();
  }

  private async init() {
    //this.scene = new Three.Scene();

    const container = document.getElementById('container');

    if (container) {
      this.scene = new SceneBuilder(container);
      await this.scene.load()
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
    min-width: 800px;
    min-height: 1000px;
  }
</style>
