<template>
    <div vif="Mission"> 
      <form class="pure-form pure-form-aligned">
          <fieldset>
              
              <h3>Mission Description: </h3>
              <input class="pure-input-1 description" type="text" v-model="description"/>
              <span id="descriptionError" class="validation-error"></span >
              <hr/>
              <h3>Launch Date</h3>
              <div class="pure-control-group">
                  <label>Earliest: </label>
                  <date-picker v-model="tmin1" format="YYYY MMM DD"></date-picker>
                  <HelpButton :message="'Earliest allowable launch date'"/>
                  <span id="tmin1Error" class="validation-error"></span >
              </div>
              <div class="pure-control-group">
                  <label>Initial: </label>
                  <date-picker v-model="t01" format="YYYY MMM DD"></date-picker>
                  <HelpButton :message="'Initial guess for the launch date'"/>
                  <span id="t0Error" class="validation-error"></span >
              </div>
              <div class="pure-control-group">
                  <label>Latest: </label>
                  <date-picker v-model="tmax1" format="YYYY MMM DD"></date-picker>
                  <HelpButton :message="'Latest allowable launch date'"/>
                  <span id="tmax1Error" class="validation-error"></span >
              </div>
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
                        <MissionStageEdit v-for="index in stageIndexes" 
                          :key="index" 
                          :stageIndex="index"
                          :lastStage="index === stageIndexes.length - 1"
                          :naifId="Mission.objectParameters.ID[index]"
                          @editClicked="editClicked(index)"
                          @deleteClicked="removeLastStageClicked(index)"/>
                    </tbody>
                  </table>
                  <p>
                    <button type="button" class="pure-button" @click="addStageClicked()">
                      <span class="oi" data-glyph="plus"></span> Add Stage
                    </button>
                  </p>
              <hr/>
              <h3>Optimizer Details</h3>
              <div class="pure-control-group">
                  <label>Duration (seconds): </label>
                  <input type="number" v-model.number="duration"/>
                  <HelpButton :message="'Limit on Total Mission duration in seconds. 0 means no constraint.'"/>
                  <span id="durationError" class="validation-error"></span >
              </div>
              <div class="pure-control-group">
                  <label>nData: </label>
                  <input type="number" v-model.number="nData"/>
                  <HelpButton :message="'Number of steps in a year, e.g. 365 means the time step will be 1 day'"/>
                  <span id="nDataError" class="validation-error"></span >
              </div>
              <div class="pure-control-group">
                  <label>Run time (minutes): </label>
                  <input type="number" v-model.number="runtime"/>
                  <HelpButton :message="'Run time for optimization in minutes'"/>
                  <span id="runtimeError" class="validation-error"></span >
              </div>
              <div class="pure-controls">
                <label class="pure-checkbox">
                    <input type="checkbox" v-model="rendezVous"/>
                    Rendez-Vous:
                    <HelpButton :message="'Flag to indicate if there is a rendezvous at final destination'"/>
                </label>

                <label class="pure-checkbox">
                <input type="checkbox" v-model="progradeOnly"/>
                    Prograde Only:
                    <HelpButton :message="'Flag to indicate that each transfer should be prograde only'"/>
                </label>

                 <label class="pure-checkbox">
                <input type="checkbox" v-model="trajectoryOptimization"/>
                    Trajectory Optimisation:
                    <HelpButton :message="'Runs optimizer to get best trajectory otherwise use initial guess values'"/>
                </label>
              </div>

              <hr/>
              <h4>Binary Spice Files
                <HelpButton :message="'Filenames for Binary Spice Kernels'"/>
              </h4>
              <div class="pure-control-group">
                <multiselect v-model="bsp" :options="spiceFiles" :multiple="true">
                </multiselect>
            </div>


          </fieldset>
      </form >
      <div class="pure-controls">
        <button type="button" class="pure-button pure-button-primary" @click="save">Launch new Mission</button>
      </div>
      <hr/>
      <MissionStageDetails ref="missionStageDetails" @stageUpdated="onStageUpdated"/>
    </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Component, Vue } from 'vue-property-decorator';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import Multiselect from 'vue-multiselect'
import HelpButton from '@/components/HelpButton.vue';
import MissionStageEdit from './MissionStageEdit.vue';
import MissionStageDetails from './MissionStageDetails.vue';
import { namespace } from 'vuex-class';
import Mission from '@/models/missions/mission';
import config from '@/config';
import store from '@/store';
import moment from 'moment';
import Validator from '@/helpers/validator';
import { ValidationType } from '@/helpers/field_validation';

const Missions = namespace('Missions');

@Component({
  components: {
    Multiselect,
    HelpButton,
    MissionStageEdit,
    MissionStageDetails,
    DatePicker
  },
})
export default class MissionEdit extends Vue { 

  public description = '';

  public duration = 0;

  public progradeOnly = false;

  public rendezVous = false;

  public trajectoryOptimization = true;

  public nData = 200;

  public runtime = 20;

  public stageIndexes: Array<number> = [];

  public bsp: string[] = [];

  public get spiceFiles(): string[] {
    return config.binarySpiceFiles;
  }

  public tmin1 = moment().toDate();

  public tmax1 = moment().toDate();

  public t01 = moment().toDate();

  @Missions.State
  public Mission!: Mission;

  private get validator(): Validator {
    return new Validator(this, [{
        FieldName: 'description',
        ValidationMessageId: 'descriptionError',
        rules: [{
            Type: ValidationType.Required,
          }]
      },{
        FieldName: 'tmin1',
        ValidationMessageId: 'tmin1Error',
        rules: [{
            Type: ValidationType.Required,
          }]
      },{
        FieldName: 't01',
        ValidationMessageId: 't01Error',
        rules: [{
            Type: ValidationType.Required,
          },{
            Type: ValidationType.Minimum,
            Params: this.tmin1
          }]
      },{
        FieldName: 'tmax1',
        ValidationMessageId: 'tmax1Error',
        rules: [{
            Type: ValidationType.Required,
          },{
            Type: ValidationType.Minimum,
            Params: this.t01
          }]
      },{
        FieldName: 'duration',
        ValidationMessageId: 'durationError',
        rules: [{
            Type: ValidationType.Required,
          },{
            Type: ValidationType.Minimum,
            Params: 0
          }]
      },{
        FieldName: 'nData',
        ValidationMessageId: 'nDataError',
        rules: [{
            Type: ValidationType.Required,
          },{
            Type: ValidationType.Minimum,
            Params: 0
          }]
      },{
        FieldName: 'runtime',
        ValidationMessageId: 'runtimeError',
        rules: [{
            Type: ValidationType.Required,
          },{
            Type: ValidationType.Minimum,
            Params: 0
          }]
      }
    ]);
  }

  protected mounted() {
    this.refreshData();
  }

  protected async save() {
    window.console.log(`MissionEdit.save()`);

    if (this.validator.IsValid()) {
      try {
        if (this.Mission && this.Mission.objectParameters) {
          this.Mission.description = this.description;
          this.Mission.objectParameters.description = this.description;
          this.Mission.objectParameters.t01 = moment(this.t01).format('YYYY MMM DD').toLowerCase();
          this.Mission.objectParameters.tmin1 = moment(this.tmin1).format('YYYY MMM DD').toLowerCase();
          this.Mission.objectParameters.tmax1 = moment(this.tmax1).format('YYYY MMM DD').toLowerCase();
          this.Mission.objectParameters.Duration = this.duration;
          this.Mission.objectParameters.PROGRADE_ONLY = this.progradeOnly;
          this.Mission.objectParameters.RENDEZVOUS = this.rendezVous;
          this.Mission.objectParameters.trajectory_optimization = this.trajectoryOptimization;
          this.Mission.objectParameters.Ndata = this.nData;
          this.Mission.objectParameters.RUN_TIME = this.runtime;
          this.Mission.objectParameters.BSP = this.bsp;
          this.Mission.objectParameters.Nbody = this.Mission.objectParameters.Periacon.length;
          this.Mission.objectParameters.NIP = this.Mission.objectParameters.rIP.length;
          await store.dispatch('Missions/PostSelectedMission');

          this.$router.push('/');
        }
      } catch(ex) {
        window.alert(ex);
      }
    }
  }


  private refreshData() {
    this.description = `${this.Mission?.description} - copy`;
    this.t01 = moment(this.Mission?.objectParameters?.t01, 'YYYY MMM DD').toDate();
    this.tmin1 = moment(this.Mission?.objectParameters?.tmin1, 'YYYY MMM DD').toDate();
    this.tmax1 = moment(this.Mission?.objectParameters?.tmax1, 'YYYY MMM DD').toDate();
    this.duration = this.Mission?.objectParameters?.Duration;
    this.progradeOnly = this.Mission?.objectParameters?.PROGRADE_ONLY;
    this.rendezVous = this.Mission?.objectParameters?.RENDEZVOUS;
    this.nData = this.Mission?.objectParameters?.Ndata;
    this.runtime = this.Mission?.objectParameters?.RUN_TIME;
    this.bsp = this.Mission?.objectParameters?.BSP;
    this.trajectoryOptimization = this.Mission.objectParameters.trajectory_optimization;
    this.refreshStageData();
  }

  private refreshStageData() {
    this.stageIndexes = [];
    for (let i=0; i < this.Mission?.objectParameters?.ID?.length || 0; i++ ) {
      this.stageIndexes.push(i);
    }
  }

  private editClicked(stageIndex: number) {
    window.console.log(`MissionEdit.editClicked(stageIndex: ${stageIndex})`);
    const modal = this.$refs.missionStageDetails as MissionStageDetails;
    modal.show(stageIndex);
  }

  private addStageClicked() {
    store.dispatch('Missions/AddStageToSelectedMission');
    this.refreshStageData();
  }

  private removeLastStageClicked(stageIndex: number) {
    if (stageIndex === this.stageIndexes.length - 1) {
      store.dispatch('Missions/RemoveLastStageFromSelectedMission');
      this.refreshStageData();
    }
  }

  private onStageUpdated(stageIndex: number) {
    window.console.log(`MissionEdit.onStageUpdated(stageIndex: ${stageIndex})`);
    window.console.log(`this.Mission`);
    window.console.log(this.Mission);

    window.console.log(`store.state.Missions.Mission`);
    window.console.log(store.state.Missions.Mission);
    this.refreshStageData();
  }

  private momentFormat = {
     stringify: (date: Date) => {
        return date ? moment(date).format('LL') : ''
      },
  }
}

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
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

.validation-error {
  color: red;
  font-size: small;
  margin-left: 0.5em;
}

</style>

