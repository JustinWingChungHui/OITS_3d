<template>
  <div class="animation">
    <Loading />
    <Scene />
    <div class="float-controls-container">
      <TimeStats />
      <ControlPanel />
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
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    Scene,
    TimeStats,
    ControlPanel,
    Loading,
    Slider
  },
})
export default class Animation extends Vue { }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.float-controls-container {
  width: 90%;
  margin: 1em 5%;
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

