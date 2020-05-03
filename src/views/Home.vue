<template>
  <div class="home">
    <Loading />
    <Scene />
    <Stats />
    <Controls />
  </div>
</template>

<script lang="ts">
import Scene from '@/components/Scene.vue';
import Stats from '@/components/Stats.vue';
import Controls from '@/components/Controls.vue';
import Loading from '@/components/Loading.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    Scene,
    Stats,
    Controls,
    Loading
  },
})
export default class Home extends Vue { }

</script>
