<template>
  <div>
    <MissionsList/>
    <Loading/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MissionsList from '@/components/home/MissionsList.vue';
import Loading from '@/components/Loading.vue';

@Component({
  components: {
    MissionsList,
    Loading
  },
})
export default class Home extends Vue { }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

