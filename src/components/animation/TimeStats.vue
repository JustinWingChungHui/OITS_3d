<template>
  <div class="stats-container">
      <div><strong>t: </strong> {{ t }}</div>
      <div><strong> Date: </strong>{{ formattedDate }}</div>
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
    return moment(store.getters['MissionAnimation/tDate']).format("YYYY-MM-DD");
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .stats-container {
    margin: 1em;
    float: left;
  }

  strong {
    font-weight: bold;
  }
</style>
