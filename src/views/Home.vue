<template>
  <div class="home">
    <Scene />
    <Stats />
  </div>
</template>

<script>
// @ is an alias to /src
import Scene from '@/components/Scene.vue'
import Stats from '@/components/Stats.vue'

export default {
  name: 'Home',
  components: {
    Scene,
    Stats
  }
}
</script>
