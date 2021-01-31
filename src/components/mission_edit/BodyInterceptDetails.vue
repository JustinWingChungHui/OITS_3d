<template>
  <div>
    <div class="pure-control-group">
      
        <label> Periacon (km):</label>
        <input type="number" v-model.number="periacon"/>
        <HelpButton :message="'Periapsis distance Constraint.  Minimum altitude in km.'"/>
        <span id="periaconError" class="validation-error"></span >
    </div>
    <div class="pure-control-group" v-if="stageIndex !== 0">
        <label>Perihcon (AU): </label>
        <input type="number" v-model.number="perihcon" />
        <HelpButton :message="'Minimum Perihelia for transfer from previous body'"/>
        <span id="perihconError" class="validation-error"></span>
    </div>
    <div class="pure-control-group">
        <label>DeltaV Constraint (m/s): </label>
        <input type="number" v-model.number="dVcon"/>
        <HelpButton :message="'=0: no constraint, <0: Indicates absolute value is minimum, >0 Indicates value is maximum'"/>
        <span id="dVconError" class="validation-error"></span>
    </div>

    <h4>Flight Time</h4>
    <div class="pure-control-group">
        <label>Maximum (days): </label>
        <input type="number" v-model.number="tmax" :readonly="stageIndex === 0"/>
        <HelpButton :message="'Upper bound for flight time. 0 for home planet'"/>
        <span id="tmaxError" class="validation-error"></span>
    </div>
    <div class="pure-control-group">
        <label>Initial (days): </label>
        <input type="number" v-model.number="t0" :readonly="stageIndex === 0"/>
        <HelpButton :message="'Initial guess for flight time. 0 for home planet'"/>
        <span id="t0Error" class="validation-error"></span>
    </div>
    <div class="pure-control-group">
        <label>Minimum (days): </label>
        <input type="number" v-model.number="tmin" :readonly="stageIndex === 0"/>
        <HelpButton :message="'Lower bound for flight time. 0 for home planet'"/>
        <span id="tminError" class="validation-error"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import HelpButton from '@/components/HelpButton.vue';
import { namespace } from 'vuex-class';
import Mission from '@/models/missions/mission';
import BodyStage from '@/models/missions/body_stage'
import store from '@/store';
import Validator from '@/helpers/validator';
import { ValidationType } from '@/helpers/field_validation';
const Missions = namespace('Missions');

@Component({
  components: {
    HelpButton,
  }
})
export default class BodyInterceptDetails extends Vue { 

  @Missions.State
  public Mission!: Mission;

  @Prop()
  public ID?: string;

  public stageIndex = 0;

  public periacon = 0;

  public perihcon = 0;

  public dVcon = 0;

  public tmax = 0;
  public t0 = 0;
  public tmin = 0;

  public validationError = '';
  
  private get validator(): Validator {
    return new Validator(this, [{
        FieldName: 'periacon',
        ValidationMessageId: 'periaconError',
        rules: [{
            Type: ValidationType.Required,
          },{
            Type: ValidationType.Minimum,
            Params: 0
          }]
      },{
        FieldName: 'perihcon',
        ValidationMessageId: 'perihconError',
        rules: [{
            Type: ValidationType.Required,
          },{
            Type: ValidationType.Minimum,
            Params: 0
          }]
      },{
        FieldName: 'dVcon',
        ValidationMessageId: 'dVconError',
        rules: [{
            Type: ValidationType.Required,
          }]
      },{
        FieldName: 'tmax',
        ValidationMessageId: 'tmaxError',
        rules: [{
            Type: ValidationType.Required,
          },{
            Type: ValidationType.Minimum,
            Params: this.t0
          }]
      },{
        FieldName: 't0',
        ValidationMessageId: 't0Error',
        rules: [{
            Type: ValidationType.Required,
          },{
            Type: ValidationType.Minimum,
            Params: this.tmin
          }]
      },{
        FieldName: 'tmin',
        ValidationMessageId: 'tminError',
        rules: [{
            Type: ValidationType.Required,
          },{
            Type: ValidationType.Minimum,
            Params: 0
          }]
      }
    ]);
  }


  public loadData(stageIndex: number) {
    window.console.log('BodyInterceptDetails.mounted()');
    this.stageIndex = stageIndex

    if (this.Mission.objectParameters.Perihcon.length > stageIndex) {
      this.periacon = this.Mission.objectParameters.Periacon[this.stageIndex];
      this.perihcon = this.Mission.objectParameters.Perihcon[this.stageIndex];
      this.dVcon = this.Mission.objectParameters.dVcon[this.stageIndex];
      this.tmax = this.Mission.objectParameters.tmax[this.stageIndex];
      this.t0 = this.Mission.objectParameters.t0[this.stageIndex];
      this.tmin = this.Mission.objectParameters.tmin[this.stageIndex];
    }

    this.validator.clearValidationMessages();
  }


  public apply() {

    if (this.ID) {

      const bodyStage: BodyStage = {
        StageIndex: this.stageIndex,
        ID: this.ID,
        Periacon: this.perihcon,
        Perihcon: this.perihcon,
        dVcon: this.dVcon,
        t0: this.t0,
        tmax: this.tmax,
        tmin: this.tmin
      };

      store.dispatch('Missions/UpdateBodyStage', bodyStage);
    }
  }

  public isValid(): boolean {
    return this.validator.IsValid();
  }


}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.validation-error {
  color: red;
  font-size: small;
  margin-left: 0.5em;
}
</style>

