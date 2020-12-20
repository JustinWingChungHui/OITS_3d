<template>
  <div>
    <div class="pure-control-group">
        <label>Periacon (km): </label>
        <input type="number" v-model="periacon"/>
        <HelpButton :message="'Periapsis distance Constraint.  Minimum altitude in km.'"/>
    </div>
    <div class="pure-control-group" v-if="stageIndex !== 0">
        <label>Perihcon (AU): </label>
        <input type="number" v-model="perihcon" />
        <HelpButton :message="'Minimum Perihelia for transfer from previous body'"/>
    </div>
    <div class="pure-control-group">
        <label>DeltaV Constraint (m/s): </label>
        <input type="number" v-model="periacon"/>
        <HelpButton :message="'=0: no constraint, <0: Indicates absolute value is minimum, >0 Indicates value is maximum'"/>
    </div>

    <h4>Flight Time</h4>
    <div class="pure-control-group">
        <label>Maximum (days): </label>
        <input type="number" v-model="tmax" :readonly="stageIndex === 0"/>
        <HelpButton :message="'Upper bound for flight time. 0 for home planet'"/>
    </div>
    <div class="pure-control-group">
        <label>Initial (days): </label>
        <input type="number" v-model="t0" :readonly="stageIndex === 0"/>
        <HelpButton :message="'Initial guess for flight time. 0 for home planet'"/>
    </div>
    <div class="pure-control-group">
        <label>Minimum (days): </label>
        <input type="number" v-model="tmin" :readonly="stageIndex === 0"/>
        <HelpButton :message="'Lower bound for flight time. 0 for home planet'"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelpButton from '@/components/HelpButton.vue';
import { namespace } from 'vuex-class';
import Mission from '@/models/missions/mission';
const Missions = namespace('Missions');

@Component({
  components: {
    HelpButton,
  },
})
export default class BodyInterceptDetails extends Vue { 

  @Missions.State
  public Mission!: Mission;

  public stageIndex = 0;

  public periacon = 0;

  public perihcon = 0;

  public dVcon = 0;

  public tmax = 0;
  public t0 = 0;
  public tmin = 0;

  public get isIntermediatePoint(): boolean {
    return this.Mission.objectParameters.ID[this.stageIndex]?.toUpperCase()?.trim() === 'INTERMEDIATE POINT';
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
  }
}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

