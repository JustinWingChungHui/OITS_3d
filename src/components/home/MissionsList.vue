<template>
<div>
    <p>To create a new mission, create a copy of an existing mission and edit it:</p>
    <table class="pure-table pure-table-striped mission-list">
         <thead>
        <tr>
          <th>ID</th>
          <th>Description</th>
          <th>Created At</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
          <MissionEntry v-for="m in Missions" :key="m.pk" :Mission="m" @onDelete="onDelete" />
      </tbody>
    </table>
    <MissionDelete ref="missionDelete" />
</div>
</template>

<script lang="ts">
import VanillaModal from 'vanilla-modal';
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';
import MissionEntry from './MissionEntry.vue';
import Mission from '@/models/missions/mission';
import MissionDelete from './MissionDelete.vue';
import { namespace } from 'vuex-class';
const Missions = namespace('Missions');

@Component({
  components: {
    MissionEntry,
    MissionDelete
  },
})
export default class MissionsList extends Vue { 

  public modal?: VanillaModal;

  @Missions.State('Missions')
  public Missions!: Mission[]

  protected async mounted() {
    await store.dispatch('Missions/GetMissions');
    store.dispatch('Missions/EnableMissionUpdates');

    this.modal = new VanillaModal();
  }

  private onDelete(missionId: number) {
    const missionDelete = this.$refs.missionDelete as MissionDelete;
    missionDelete.show(missionId);
  }
}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../../css/modal.css';
 .mission-list {
    max-width: 960px;
    margin: 0 auto;
    width: 100%;
 }

p {
    max-width: 960px;
    margin: 0 auto;
    padding: 1em;
    text-align: center;
    border-bottom: 1px solid #eee;
}
</style>

