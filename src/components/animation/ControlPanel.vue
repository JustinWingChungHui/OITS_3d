<template>
  <div class="controls-container">
    <button class="pure-button rewind-btn" @click="rewind()">
      <span class="oi" data-glyph="media-step-backward" title="Rewind" aria-hidden="true"></span>
    </button>
    <button class="pure-button play-btn" @click="playPause()">
      <span class="oi" data-glyph="media-play" title="Play" aria-hidden="true"></span>
      <span class="play-pause-slash">/</span>
      <span class="oi" data-glyph="media-pause" title="Pause" aria-hidden="true"></span>
    </button>
    <button class="pure-button settings-btn" @click="showSettings = true">
      <span class="oi" data-glyph="cog" title="Settings" aria-hidden="true"></span>
    </button>
    
    <Settings v-show="showSettings" :modal-open="showSettings" @close="showSettings = false"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MissionState } from '@/models/missions/mission_state';
import 'open-iconic/font/css/open-iconic.css';
import AnimationState from '@/models/animation_state';
import Settings from './Settings.vue';

const showSettings = ref(false);

onMounted(() => {
  showSettings.value = false;
})

const rewind = () => {
  MissionState.animationState = AnimationState.rewind;
};

const playPause = () => {
  console.log(`playPause()`);

  if (MissionState.IsAnimating()) {
    MissionState.animationState = AnimationState.paused;
  } else {
    MissionState.animationState = AnimationState.playing;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .controls-container {
    margin: 1em;
    float: left;
  }

  button::-moz-focus-inner { border: 0; }

  .rewind-btn {
    color: white;
    background-color: #dc3545;
    border-color: #dc3545;
    margin-right: 5px;
  }
  .rewind-btn:hover {
    background-color: #bc1525;
    border-color: #bc1525;
  }

  .play-btn {
    color: white;
    background-color: #28a745;
    border-color: #28a745;
    margin-right: 5px;
  }
  .play-btn:hover {
    background-color: #088725;
    border-color: #088725;
  }

  .settings-btn, .play-btn, .rewind-btn {
    border-radius: 4px;
  }
</style>
