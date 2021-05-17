<template>
  <div id="container"></div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import SceneBuilder from '@/scene_builders/scene-builder';
import store from '@/store';
import { namespace } from 'vuex-class';
const UserSettings = namespace('UserSettings');

@Component
export default class Scene extends Vue {

  @Prop({default: 0})
  public id?: number;

  private scene: SceneBuilder | null = null;

  private initialising = false;

  @UserSettings.State('LastUpdatedDate')
  private settingsLastUpdatedDate!: Date

  protected async mounted() {
    this.initialising = true;
    await this.init();
    this.initialising = false;
  }


  private async init() {
    console.log(`Scene.init()`);

    store.dispatch('MissionAnimation/UpdateLoading', true);

    console.log(`id: ${this.id}`);
    const container = document.getElementById('container');

    if (this.id && container) {

      try {
      const height = window.innerHeight - container.getBoundingClientRect().top - 200;
      container.style.height = `${height}px`;
      await store.dispatch('MissionAnimation/UpdateId', this.id)
      await this.buildScene(container);
      
      } catch(ex) {
        console.log(ex);
        window.alert('Error occured loading data');
      }
    }
  }

  private async buildScene(container: HTMLElement) {
    console.log(`Scene.buildScene()`);

    store.dispatch('MissionAnimation/UpdateLoading', true);
    this.scene = new SceneBuilder(container);
    await this.scene.load()
    store.dispatch('MissionAnimation/UpdateLoading', false);
    this.scene.animate(); 
  }

  @Watch('settingsLastUpdatedDate')
  private async onsettingsLastUpdatedDateChanged(newValue: Date, oldValue: Date) {
    window.console.log(`onsettingsLastUpdatedDateChanged(${oldValue}, ${newValue}`)
    if (newValue > oldValue && !this.initialising) {

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
