<template>
  <div class="slider-container">
    <label>
        Playback Speed
    </label>
      <input type="range" min="-20" max="25" v-model="value" class="slider">
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
        const playbackSpeed = Math.pow(1.2, val);

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
    margin-left: 5px;
    margin-right : 5px
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

