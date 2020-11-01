<template>
    <div class="header">
        <h1>Adam Hibberd's Optical Interplanetary Trajectory Software</h1>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Header extends Vue { }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header {
    font-family: Raleway,Helvetica Neue,Helvetica,Arial,sans-serif;
    max-width: 768px;
    margin: 0 auto;
    padding: 1em;
    text-align: center;
    border-bottom: 1px solid #eee;
    background: #fff;
    letter-spacing: .05em;
    color: #4b4b4b;
    line-height: 1.6;
  }

  .header h1 {
        font-weight: 100;
      margin: 0;
  }
</style>

