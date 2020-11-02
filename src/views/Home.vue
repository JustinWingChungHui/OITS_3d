<template>
  <div>
    <MissionsList/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MissionsList from '@/components/home/MissionsList.vue';

@Component({
  components: {
    MissionsList
  },
})
export default class Home extends Vue { }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

