<template>
    <div>
      <div id="missionStageDetailsModal" style="display:none;">
        <div class="missionStageDetailsModalContent">
          <h2>Stage Details</h2>
          <div class="pure-form pure-form-aligned">
            <div class="pure-control-group">
                <label>Body:</label>
                <select v-model="naifId">
                    <option v-for="(item, key) in bodiesByNAIFCodes" :key="key" :value="key">{{key}} - {{item}}</option>
                </select>
                <!-- <HelpButton :message="'Body to Visit'"/> -->
            </div>

             <hr/>

              <BodyInterceptDetails ref="bodyInterceptDetails" :ID="naifId"/>
              <IntermediatePointDetails v-show="isIntermediatePoint" ref="intermediatePointDetails" />

              <div class="pure-controls">
                <button class="pure-button pure-button-primary" @click="apply">Apply</button>
              </div>
          </div>
        </div>
      </div>
      <div class="modal">
            <div class="modal-inner">
                <span data-modal-close class="oi" data-glyph="x"></span>
                <div class="modal-content"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import VanillaModal, { VanillaModalConfig } from 'vanilla-modal';
import HelpButton from '@/components/HelpButton.vue';
import BodyInterceptDetails from './BodyInterceptDetails.vue';
import IntermediatePointDetails from './IntermediatePointDetails.vue';
import config from '@/config';
import { namespace } from 'vuex-class';
import Mission from '@/models/missions/mission';
const Missions = namespace('Missions');

@Component({
  components: {
    HelpButton,
    BodyInterceptDetails,
    IntermediatePointDetails
  },
})
export default class MissionStageDetails extends Vue { 

  public modal?: VanillaModal;

  @Missions.State
  public Mission!: Mission;

  public stageIndex = 0;

  public naifId = '';

  public stageName = ''; 

  public get bodiesByNAIFCodes(): { [id: string]: string } {
    return config.bodiesByNAIFCodes;
  }

  public get isIntermediatePoint(): boolean {
    return this.naifId?.toUpperCase()?.trim() === 'INTERMEDIATE POINT';
  }

  public show(stageIndex: number) {
    window.console.log(`MissionStageDetails.show(${stageIndex})`);
    this.stageIndex = stageIndex;
    this.naifId = this.Mission.objectParameters.ID[this.stageIndex];
    this.stageName = config.bodiesByNAIFCodes[this.naifId];

    this.loadBodyData();

    const options: VanillaModalConfig = {
      clickOutside: false
    };

    this.modal = new VanillaModal(options);
    this.modal.open('#missionStageDetailsModal');
  }

  @Watch('naifId')
  public loadBodyData() {
     window.console.log(`MissionStageDetails.loadBodyData()`);
    const bodyInterceptDetails = this.$refs.bodyInterceptDetails as BodyInterceptDetails;
    bodyInterceptDetails.loadData(this.stageIndex);

    const intermediatePointDetails = this.$refs.intermediatePointDetails as IntermediatePointDetails;
    intermediatePointDetails.loadData(this.stageIndex);
  }

  public isValid(): boolean {
    let dataValid = true;
    const bodyInterceptDetails = this.$refs.bodyInterceptDetails as BodyInterceptDetails;
    dataValid = bodyInterceptDetails.isValid();

    if (this.isIntermediatePoint) {
        const intermediatePointDetails = this.$refs.intermediatePointDetails as IntermediatePointDetails;
        dataValid = intermediatePointDetails.isValid() && dataValid;
    }

    return dataValid;
  }

  protected mounted() {
    window.console.log(`MissionStageDetails.mounted()`);
  }

  protected apply() {
    window.console.log(`MissionStageDetails.apply()`);

    const dataValid = this.isValid();

    if (dataValid) {
      const bodyInterceptDetails = this.$refs.bodyInterceptDetails as BodyInterceptDetails;
      bodyInterceptDetails.apply();

      if (this.isIntermediatePoint) {
        const intermediatePointDetails = this.$refs.intermediatePointDetails as IntermediatePointDetails;
        intermediatePointDetails.apply();
      }

      this.$emit('stageUpdated', this.stageIndex);
      this.modal?.close();
    }
  }
}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../../css/modal.css';

.missionStageDetailsModalContent {
  padding-top: 2em;
  padding-bottom: 2em;
  padding-left: 5em;
  padding-right: 5em;

}

hr {
  border-top: 1px solid #eee;
  margin-bottom: 2em;
  margin-top: 1em;
}
</style>

