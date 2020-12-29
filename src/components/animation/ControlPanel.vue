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
    <button class="pure-button settings-btn" @click="settingsClick()">
      <span class="oi" data-glyph="cog" title="Play" aria-hidden="true"></span>
    </button>
    
    <Settings ref="settings"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';
import 'open-iconic/font/css/open-iconic.css';
import AnimationState from '@/models/animation_state';
import Settings from './Settings.vue';

@Component@Component({
  components: {
    Settings
  },
})
export default class ControlPanel extends Vue {

  public rewind() {
    store.dispatch('MissionAnimation/UpdateAnimationState', AnimationState.rewind);
  }

  public playPause() {
    window.console.log(`playPause()`);

    const isAnimating = store.getters['MissionAnimation/IsAnimating'];
    window.console.log(`isAnimating: ${isAnimating}`);
    if (isAnimating) {
      store.dispatch('MissionAnimation/UpdateAnimationState', AnimationState.paused);
    } else {
      store.dispatch('MissionAnimation/UpdateAnimationState', AnimationState.playing);
    }
  }

  public settingsClick() {
    window.console.log(`settingsClick()`);
    (this.$refs.settings as Settings).show();
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
