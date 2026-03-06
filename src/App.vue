<template>
  <div id="app">
    <Header v-if="route.name !== 'Animation'" />
    <div id="nav" v-if="route.name !== 'Animation'">
      <router-link to="/">MISSIONS</router-link>
      <router-link to="/about">ABOUT</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';

const route = useRoute();
</script>

<style scoped>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  letter-spacing: .01em;
  color: #888;
  line-height: 1.6;
}

#nav {
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1em;
  padding-right: 1em;
  max-width: 768px;
  letter-spacing: .01em;
  font-weight: 300;
  text-align: center;
  line-height: 1.6;
}

#nav a {
  padding: 2em;
  color: #999;
}

#nav a.router-link-exact-active {
  color: black;
}

body {
  height: 100%;
  margin: 0
}
</style>
