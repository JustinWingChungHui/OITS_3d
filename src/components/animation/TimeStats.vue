<template>
  <div class="stats-container">
      <div><strong> Date: </strong>{{ formattedDate }}</div>
      <div><strong> Sun Distance (AU): </strong>{{ distanceFromSun.toFixed(5) }}</div>
      <div><strong> Earth Distance (AU): </strong>{{ distanceFromEarth.toFixed(5) }}</div>
      <div v-if="probeSpeed"><strong> Speed (Km/s): </strong>{{ probeSpeed }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DateTime } from 'luxon';
import { MissionState } from '@/models/missions/mission_state';

const formattedDate = ref<string>('');
const distanceFromSun = ref<number>(0);
const distanceFromEarth = ref<number>(0);
const probeSpeed = ref<number | null>(null);

setInterval(() => {
  formattedDate.value = DateTime.fromJSDate(MissionState.tDate()).toLocaleString(DateTime.DATETIME_MED);
  distanceFromSun.value = MissionState.distanceFromSun;
  distanceFromEarth.value = MissionState.distanceFromEarth;
  probeSpeed.value = MissionState.probeSpeed;
}, 20);

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
