<template>
  <div class="slider-container">
    <label>
        Playback Speed
    </label>
      <input type="range" min="-3" max="20" v-model="value" class="slider">
      <!--v-on:input="onValueChanged($event)" -->
  </div>
</template>


<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import store from '@/store';

@Component
export default class Slider extends Vue {

    public value = 0;

    @Watch('value')
    public onValueChanged() {
        window.console.log(`onValueChanged() ${this.value}`)
        const val = Number(this.value);
        let playbackSpeed = 1;
        if (val < 0) {
            // Allows 1/2, 1/4, 1/8
            playbackSpeed = Math.pow(2, val);

        } else {
            playbackSpeed = val + 1;
        }

        store.dispatch('setPlaybackSpeed', playbackSpeed);
    }

}



</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.slider-container {
    width: 100%; /* Width of the outside container */
    padding: 10px;
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

