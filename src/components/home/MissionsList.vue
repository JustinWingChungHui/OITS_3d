<template>
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
          <MissionEntry v-for="m in Missions" :key="m.pk" :Mission="m" />
      </tbody>
    </table>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';
import MissionEntry from './MissionEntry.vue';
import Mission from '@/models/missions/mission';
import { namespace } from 'vuex-class';
const Missions = namespace('Missions');

@Component({
  components: {
    MissionEntry
  },
})
export default class MissionsList extends Vue { 

  @Missions.State('Missions')
  public Missions!: Mission[]

  protected async mounted() {
    await store.dispatch('Missions/GetMissions');
    store.dispatch('Missions/EnableMissionUpdates');
  }
}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .mission-list {
    max-width: 768px;
    margin: 0 auto;
    width: 100%;
 }

</style>

