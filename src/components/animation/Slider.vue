<template>
  <div class="slider-container">
    <label>
        Playback Speed:
    </label>
    <input type="range" min="-20" max="25" v-model="value" class="slider">
  </div>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue';
import { MissionState } from '@/models/missions/mission_state';

const value = ref(0);

watch(value, () => {
    console.log(`watch value: ${value.value}`)
    const playbackSpeed = Math.pow(1.2, value.value);

    MissionState.playbackSpeed = playbackSpeed;
})
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
label {
    font-weight: bold;
    margin-left: 0.2em;
}

.slider-container {
    width: 100%; /* Width of the outside container */
    margin-top: 5px;
    padding-top: 0px;
    padding-bottom: 0px;
    padding-left: 8px;
    padding-right: 10px;
    max-width: 400px;
}

.slider {
    -webkit-appearance: none;
    width: 100%;
    height: 15px;
    border-radius: 5px;  
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%; 
    background: #4CAF50;
    cursor: pointer;
}

.slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
}
</style>

