<template>
  <div>
    <ResultsList/>
    <Loading/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Loading from '@/components/Loading.vue';
import ResultsList from '@/components/home/ResultsList.vue';

@Component({
  components: {
    ResultsList,
    Loading
  },
})
export default class Home extends Vue { }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

