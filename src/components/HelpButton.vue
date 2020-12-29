<template>
  <span class="tool rounded" :data-tip="message">
      <span class="oi" data-glyph="info"></span>
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class HelpButton extends Vue { 
  @Prop({default: ''})
  public message?: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../css/tooltip.css';
.rounded {
  border: 2px solid #ccc;
  border-radius: 2em;
  padding-top: 0.3em;
  padding-bottom: 0.2em;
  padding-left: 0.33em;
  padding-right: 0.33em;
  color: #ccc;
  margin-left: 0.5em;
  font-size: x-small;
}

.rounded:hover {
  color: white;
  background-color: #ccc;
}
</style>