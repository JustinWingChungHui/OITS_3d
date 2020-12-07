<template>
  <div class="edit-container">
    <h2>Edit Mission</h2>
    <MissionEdit v-if="missionLoaded"/>
    <Loading />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import store from '@/store';
import MissionEdit from '@/components/mission_edit/MissionEdit.vue';
import Loading from '@/components/Loading.vue';

@Component({
  components: {
    MissionEdit,
    Loading
  },
})
export default class Edit extends Vue { 

  @Prop()
  public id?: number;

  public missionLoaded = false;


  protected async mounted() {
    console.log(`Edit.mounted() this.id:${this.id}`);
    this.missionLoaded = false;
    store.dispatch('MissionAnimation/UpdateLoading', true);
    await store.dispatch('Missions/GetMission', this.id);
    store.dispatch('MissionAnimation/UpdateLoading', false);

    // Ensure only mounted once mission has loaded
    this.missionLoaded = true;
  }

}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .edit-container {
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