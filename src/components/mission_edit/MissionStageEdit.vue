<template>
    <tr>
      <td>{{naifId}}</td>
      <td>{{stageName}}</td>
      <td>
          <span class="oi edit-stage-link" data-glyph="pencil" @click="onEditClicked"></span>
          <span v-if="lastStage" class="oi edit-stage-link" data-glyph="trash" @click="onDeleteClicked"></span>
      </td>
    </tr>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import config from '@/config';
import { namespace } from 'vuex-class';
import Mission from '@/models/missions/mission';
const Missions = namespace('Missions');

@Component({
  components: {
  },
})
export default class MissionStageEdit extends Vue { 

  @Missions.State
  public Mission!: Mission;

  @Prop()
  public stageIndex?: number;

  @Prop({default: false})
  public lastStage?: boolean;

  public get naifId(): string {
    return this.Mission.objectParameters.ID[this.stageIndex || 0];
  }

  public get stageName(): string {
    return config.bodiesByNAIFCodes[this.naifId];
  }

  protected mounted() {
    window.console.log(`MissionStageEdit.mounted()`);
  }

  protected onEditClicked() {
    this.$emit('editClicked');
  }

  protected onDeleteClicked() {
    this.$emit('deleteClicked', this.stageIndex);
  }
}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .edit-stage-link {
    cursor: pointer;
    margin: 0.75em;
    font-size: 1.25em;
    transition: 0.3s;
    color: #888;
}

  .edit-stage-link:hover{
    color: lightgrey;
  }
</style>

