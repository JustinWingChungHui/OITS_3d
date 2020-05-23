<template>
  <div class="controls-container">
    <button class="media-btn rewind-btn" @click="rewind()">
      <span class="oi" data-glyph="media-step-backward" title="Rewind" aria-hidden="true"></span>
    </button>
    <button class="media-btn play-btn" @click="playPause()">
      <span class="oi" data-glyph="media-play" title="Play" aria-hidden="true"></span>
      <span class="play-pause-slash">/</span>
      <span class="oi" data-glyph="media-pause" title="Pause" aria-hidden="true"></span>
    </button>
    <button class="media-btn fastforward-btn" @click="fastForward()">
      <span class="oi" data-glyph="media-skip-forward" title="Fast Forward" aria-hidden="true"></span>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';
import 'open-iconic/font/css/open-iconic.css';
import AnimationState from '@/models/animation_state';

@Component
export default class Controls extends Vue {

  public rewind() {
    store.dispatch('setAnimationState', AnimationState.rewind);
  }

  public playPause() {
    if (store.getters.isAnimating) {
      store.dispatch('setAnimationState', AnimationState.paused);
    } else {
      store.dispatch('setAnimationState', AnimationState.playing);
    }
  }

  public fastForward() {
    store.dispatch('setAnimationState', AnimationState.fastForward);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .controls-container {
    width: 100%;
    margin: 1em;
  }

  button::-moz-focus-inner { border: 0; }

  .media-btn {
    margin: 0.5em;
    border-radius: 0.25rem;
    padding-left: 1em;
    padding-right: 1em;
    padding-top: 0.75em;
    padding-bottom: 0.5em;
    color: white;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    border-style: solid;
    user-select: none;
    cursor: pointer;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  }

  .rewind-btn {
    background-color: #dc3545;
    border-color: #dc3545;
  }
  .rewind-btn:hover {
    background-color: #bc1525;
    border-color: #bc1525;
  }

  .play-pause-slash {
    font-size: 1.2em;
    padding-top: 0.1em;
    padding-bottom: 0.1em;
  }

  .play-btn {
    background-color: #28a745;
    border-color: #28a745;
  }
  .play-btn:hover {
    background-color: #088725;
    border-color: #088725;
  }

  .fastforward-btn {
    background-color: rgb(255, 174, 0);
    border-color: rgb(255, 174, 0);
  }

  .fastforward-btn:hover {
    background-color: rgb(215, 124, 0);
    border-color: rgb(215, 124, 0);
  }
</style>
