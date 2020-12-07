<template>
    <div vif="Mission"> 
      <form class="pure-form pure-form-aligned">
          <fieldset>
              
              <h3>Description: </h3>
              <input class="pure-input-1 description" type="text" v-model="description"/>

              <hr/>
              <h3>Stages</h3>
                  <table class="pure-table pure-table-striped full-width">
                    <thead>
                      <tr>
                        <th>NAIF ID</th>
                        <th>Body</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                        <MissionStageEdit v-for="index in stageIndexes" :key="index" :stageIndex="index" />
                    </tbody>
                  </table>
                  <p>
                    <button type="button" class="pure-button">
                      <span class="oi" data-glyph="plus"></span> Add Stage
                    </button>
                  </p>
              <hr/>
              <h3>Optimizer Details</h3>
              <div class="pure-control-group">
                  <label>Duration (seconds): </label>
                  <input type="number" v-model="duration"/>
                  <HelpButton :message="'Limit on Total Mission duration in seconds. 0 means no constraint.'"/>
              </div>
              <div class="pure-control-group">
                  <label>nData: </label>
                  <input type="number" v-model="nData"/>
                  <HelpButton :message="'Number of data points output for each transfer in turn'"/>
              </div>
              <div class="pure-control-group">
                  <label>Run time (minutes): </label>
                  <input type="number" v-model="runtime"/>
                  <HelpButton :message="'Run time for optimization in minutes'"/>
              </div>
              <div class="pure-controls">
                <label class="pure-checkbox">
                    <input type="checkbox" v-model="rendezVous"/>
                    Rendez-Vous
                    <HelpButton :message="'Flag to indicate if there is a rendezvous at final destination'"/>
                </label>

                <label class="pure-checkbox">
                <input type="checkbox" v-model="progradeOnly"/>
                    Prograde Only
                    <HelpButton :message="'Flag to indicate that each transfer should be prograde only'"/>
                </label>
              </div>


          </fieldset>
      </form >
      <div class="pure-controls">
        <button type="button" class="pure-button pure-button-primary" @click="save">Save</button>
      </div>
      <hr/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelpButton from '@/components/HelpButton.vue';
import MissionStageEdit from '@/components/mission_edit/MissionStageEdit.vue';
import { namespace } from 'vuex-class';
import Mission from '@/models/missions/mission';
const Missions = namespace('Missions');

@Component({
  components: {
    HelpButton,
    MissionStageEdit,
  },
})
export default class MissionEdit extends Vue { 

  public description = '';

  public duration = 0;

  public progradeOnly = false;

  public rendezVous = false;

  public nData = 200;

  public runtime = 20;

  public stageIndexes: Array<number> = [];


  @Missions.State
  public Mission!: Mission;


  protected mounted() {
    this.refreshData();
  }

  protected save() {
    window.console.log(`MissionEdit.save()`);
  }

  private refreshData() {
    this.description = this.Mission?.description;
    this.duration = this.Mission?.objectParameters?.Duration;
    this.progradeOnly = this.Mission?.objectParameters?.PROGRADE_ONLY;
    this.rendezVous = this.Mission?.objectParameters?.RENDEZVOUS;
    this.nData = this.Mission?.objectParameters?.Ndata;
    this.runtime = this.Mission?.objectParameters?.RUN_TIME;

    for (let i=0; i < this.Mission?.objectParameters?.ID?.length || 0; i++ ) {
      this.stageIndexes.push(i);
    }
  }
}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
hr {
  border-top: 1px solid #eee;
  margin-bottom: 2em;
  margin-top: 1em;
}

.full-width {
  width: 100%;
}
</style>

