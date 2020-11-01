<template>
  <div>
    <div class="about-content">
    <h1>About</h1>
    <p>
      The Optical Interplanetary Trajectory Software is software that find the most optimized trajectory between bodies in the solar system to reduce the amount of fuel needed.
    </p>

    <h3>Credits</h3>
    <p>
        OITS was created by Adam Hibberd 
        <a href="https://github.com/AdamHibberd">https://github.com/AdamHibberd</a>
    </p>
    <p>
        Website was created by Justin Wing Chung Hui 
        <a href="https://github.com/justinwingchunghui">https://github.com/justinwingchunghui</a>
    </p>
    <p>
        Planetary Textures have been used from 
        <a href="https://www.solarsystemscope.com/textures/">https://www.solarsystemscope.com/textures/</a>
        under the 'Attribution 4.0 International Licence'
    </p>
    <p>
      Asteroid glTF model has been used from 
      <a href="https://sketchfab.com/Oziry">https://sketchfab.com/Oziry</a>
      under the 'Attribution 4.0 International Licence'
    </p>
    <p>
      Pioneer glTF model has been used from 
      <a href="https://sketchfab.com/NASA">https://sketchfab.com/NASA</a>
      under the 'Attribution 4.0 International Licence'
    </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class About extends Vue { }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .about-content {
    margin-left: auto;
    margin-right: auto;
    padding-left: 1em;
    padding-right: 1em;
    max-width: 768px;
    font-family: Helvetica,Arial,sans-serif;
    letter-spacing: .01em;
    font-weight: 300;
    color: #888;
    line-height: 1.6;
  }

</style>