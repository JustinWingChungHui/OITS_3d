<template>
  <div>
    <Loading />
    <Scene :url-base64="urlBase64"/>
    <div class="animation-controls-container">
      <TimeStats />
      <ControlPanel />
      <Slider/>
    </div>
  </div>
</template>

<script setup lang="ts">
import Scene from '@/components/animation/Scene.vue';
import TimeStats from '@/components/animation/TimeStats.vue';
import ControlPanel from '@/components/animation/ControlPanel.vue';
import Loading from '@/components/Loading.vue';
import Slider from '@/components/animation/Slider.vue';

  defineProps<{ urlBase64?: string }>()
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.animation-controls-container {
  display: flex;
  flex-wrap: wrap;
  z-index: 10;
  position: fixed;
  width: 100%; 
  bottom: 0;
  padding-bottom: 0.5em;
  background-color: white;
}
</style>

