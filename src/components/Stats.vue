<template>
  <div class="stats-container">
    <strong>t:</strong> {{ t }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';

@Component
export default class Stats extends Vue {

  private get t(): number {
    return store.state.t;
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .stats-container {
    width: 100%;
    margin: 1em;
  }
</style>
