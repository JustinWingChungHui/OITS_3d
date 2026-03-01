<template>
  <div class="stats-container">
      <div><strong> Date: </strong>{{ formattedDate }}</div>
      <div><strong> Sun Distance (AU): </strong>{{ DistanceFromSun }}</div>
      <div><strong> Earth Distance (AU): </strong>{{ DistanceFromEarth }}</div>
      <div v-if="ProbeSpeed"><strong> Speed (Km/s): </strong>{{ ProbeSpeed }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';
import moment from 'moment/moment';

@Component
export default class TimeStats extends Vue {

  private get t(): number {
    return store.state.MissionAnimation.t;
  }

  private get formattedDate(): string {
    return moment(store.getters['MissionAnimation/tDate']).format("YYYY-MM-DD hh:mm");
  }

  private get DistanceFromSun(): number {
    return store.state.MissionAnimation.DistanceFromSun.toFixed(5);
  }

  private get DistanceFromEarth(): number {
    return store.state.MissionAnimation.DistanceFromEarth.toFixed(5);
  }

  private get ProbeSpeed(): number | null {
    return store.state.MissionAnimation.ProbeSpeed;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .stats-container {
    margin: 0.5em;
    float: left;
    min-width: 20em;
  }

  strong {
    font-weight: bold;
  }
</style>
