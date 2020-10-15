<template>
  <div class="home">
    <Loading />
    <Scene />
    <div class="float-controls-container">
      <TimeStats />
      <ControlPanel />
    </div>
      <Slider/>
    
  </div>
</template>

<script lang="ts">
import Scene from '@/components/Scene.vue';
import TimeStats from '@/components/TimeStats.vue';
import ControlPanel from '@/components/ControlPanel.vue';
import Loading from '@/components/Loading.vue';
import Slider from '@/components/Slider.vue';
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
export default class Home extends Vue { }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.float-controls-container {
  width: 100%;
  margin: 5px;
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

