<template>
  <div>
    <h4>Intermediate Point</h4>
    <div class="pure-control-group">
        <label>Radial Distance (AU): </label>
        <input type="number" v-model="rIP"/>
        <HelpButton :message="'Radial distance of Intermediate Point from origin of ecliptic'"/>
    </div>

    <h4>Heliocentric Latitude</h4>
    <div class="pure-control-group">
        <label>Upper Bound (rad): </label>
        <input type="number" v-model="thiub"/>
        <HelpButton :message="'Upper bound of the heliocentric latitude of the Intermediate point'"/>
    </div>

    <div class="pure-control-group">
        <label>Initial (rad): </label>
        <input type="number" v-model="thiIP"/>
        <HelpButton :message="'Initial guess of the heliocentric latitude of the Intermediate point'"/>
    </div>
    <div class="pure-control-group">
        <label>Lower Bound (rad): </label>
        <input type="number" v-model="thilb"/>
        <HelpButton :message="'Lower bound of the heliocentric latitude of the Intermediate point'"/>
    </div>

    <h4>Heliocentric Longitude</h4>
    <div class="pure-control-group">
        <label>Upper Bound (rad): </label>
        <input type="number" v-model="thetaub"/>
        <HelpButton :message="'Upper bound of the heliocentric longitude of Intermediate point'"/>
    </div>
    <div class="pure-control-group">
        <label>Initial (rad): </label>
        <input type="number" v-model="thetaIP"/>
        <HelpButton :message="'Initial guess of the heliocentric longitude of Intermediate point'"/>
    </div>
    <div class="pure-control-group">
        <label>Lower Bound (rad): </label>
        <input type="number" v-model="thetalb"/>
        <HelpButton :message="'Lower bound of the heliocentric longitude of Intermediate point'"/>
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
export default class IntermediatePointDetails extends Vue { 

  @Missions.State
  public Mission!: Mission;

  public stageIndex = 0;

  public intermediatePointIndex = 0;

  public rIP = 0;

  public thetaIP = 0;

  public thetalb = 0;

  public thetaub = 0;

  public thiIP = 0;

  public thilb = 0;

  public thiub = 0;

  public get isIntermediatePoint(): boolean {
    return this.Mission.objectParameters.ID[this.stageIndex]?.toUpperCase()?.trim() === 'INTERMEDIATE POINT';
  }


  public loadData(stageIndex: number) {
    window.console.log('IntermediatePointDetails.mounted()');
    this.stageIndex = stageIndex

    if (this.isIntermediatePoint) {
      this.intermediatePointIndex = this.getIntermediatePointIndex();
     
      if (this.Mission.objectParameters.rIP.length > this.intermediatePointIndex) {
        this.rIP = this.Mission.objectParameters.rIP[this.intermediatePointIndex];
        this.thetaIP = this.Mission.objectParameters.thetaIP[this.intermediatePointIndex];
        this.thetalb = this.Mission.objectParameters.thetalb[this.intermediatePointIndex];
        this.thetaub = this.Mission.objectParameters.thetaub[this.intermediatePointIndex];
        this.thiIP = this.Mission.objectParameters.thiIP[this.intermediatePointIndex];
        this.thilb = this.Mission.objectParameters.thilb[this.intermediatePointIndex];
        this.thiub = this.Mission.objectParameters.thiub[this.intermediatePointIndex];
      }
      else {
        this.Mission.objectParameters.rIP.push(0);
        this.Mission.objectParameters.thetaIP.push(0);
        this.Mission.objectParameters.thetalb.push(0);
        this.Mission.objectParameters.thetaub.push(0);
        this.Mission.objectParameters.thiIP.push(0);
        this.Mission.objectParameters.thilb.push(0);
        this.Mission.objectParameters.thiub.push(0);
      }
    }
  }

  public apply() {
    if (this.Mission.objectParameters.rIP.length > this.intermediatePointIndex) {
      this.Mission.objectParameters.rIP[this.intermediatePointIndex] = this.rIP;
      this.Mission.objectParameters.thetaIP[this.intermediatePointIndex] = this.thetaIP;
      this.Mission.objectParameters.thetalb[this.intermediatePointIndex] = this.thetalb;
      this.Mission.objectParameters.thetaub[this.intermediatePointIndex] = this.thetaub;
      this.Mission.objectParameters.thiIP[this.intermediatePointIndex] = this.thiIP;
      this.Mission.objectParameters.thilb[this.intermediatePointIndex] = this.thilb;
      this.Mission.objectParameters.thiub[this.intermediatePointIndex] = this.thiub;

    }
  }

  private getIntermediatePointIndex(): number {
    let intermediateIndex = -1;
    let index = 0;
    for (const id of this.Mission.objectParameters.ID) {
      if (id.trim().toUpperCase() === 'INTERMEDIATE POINT') {
        intermediateIndex++
      }
      if (index == this.stageIndex) {
        return intermediateIndex;
      }
      index ++;
    }

    return intermediateIndex;
  }
}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

