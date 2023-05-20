<template>
  <div class="animation">
    <Loading />
    <Scene :url-base64="urlBase64"/>
    <div class="animation-controls-container  float-controls-container">
      <TimeStats />
      <ControlPanel />
    </div>
    <div class="animation-controls-container ">
      <Slider/>
    </div>
  </div>
</template>

<script lang="ts">
import Scene from '@/components/animation/Scene.vue';
import TimeStats from '@/components/animation/TimeStats.vue';
import ControlPanel from '@/components/animation/ControlPanel.vue';
import Loading from '@/components/Loading.vue';
import Slider from '@/components/animation/Slider.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    Scene,
    TimeStats,
    ControlPanel,
    Loading,
    Slider
  },
})
export default class Animation extends Vue { 

  @Prop({default: null})
  public urlBase64?: string;
}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.animation-controls-container {
  width: 90%;
  margin: 0.5em 5% 0em 5%;
}

.float-controls-container:before,
.float-controls-container:after {
    content: "";
    display: table;
}

.float-controls-container:after {
  clear: both;
}
</style>

