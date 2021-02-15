<template>
    <tr>
        <td>{{ Mission.id }}</td>
        <td>{{ Mission.description }}</td>
        <td>{{ FormattedDate }}</td>
        <td :class="StatusDescription">
          <i v-if="Mission.status === 'P' || Mission.status === 'A'" class="c-inline-spinner"></i>
          {{ StatusDescription }}
        </td>
        <td>
          <span class="tool" data-tip="Create Copy & Edit">
            <router-link class="mission-link create-copy" :to="{ path: `/edit/${Mission.id}` }">
                <sup><span class="oi" data-glyph="plus"></span></sup>
                <span class="oi" data-glyph="file"></span>
            </router-link>
          </span>

          <span v-if="CanDelete" class="tool" data-tip="Delete Mission">
              <span class="oi mission-link delete" data-glyph="trash" @click="onDelete"></span>
          </span>

          <span v-if="Mission.status === 'N' || Mission.status === 'P'" class="tool" data-tip="Cancel Mission">
              <span class="oi mission-link cancel" data-glyph="ban" @click="onCancel"></span>
          </span>

          <span class="tool" data-tip="Play Mission Animation">
            <router-link class="mission-link play" v-if="Mission.status === 'C'" :to="{ path: `/animation/${Mission.id}` }">
                <span class="oi" data-glyph="media-play"></span>
            </router-link>
          </span>
        </td>
    </tr>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Mission from '@/models/missions/mission';
import moment from 'moment/moment';
import store from '@/store';
import 'open-iconic/font/css/open-iconic.css';


@Component({
  components: {
  },
})
export default class MissionEntry extends Vue { 
  @Prop({default: null})
  public Mission?: Mission;

  public StatusMap: { [id: string]: string } = {
    'C': 'Complete',
    'N': 'Queued',
    'P': 'Processing',
    'A': 'Cancelling',
    'X': 'Cancelled',
    'E': 'Error'
  };

  public DeleteableStatuses = ['C', 'X', 'E'];

  public get StatusDescription(): string {
    if (this.Mission?.status) {
      return this.StatusMap[this.Mission?.status];
    } else {
      return '';
    }
  }

  public get CanDelete(): boolean {
    if (this.Mission && !this.Mission.readonly) {
      return this.DeleteableStatuses.includes(this.Mission.status)
    } else {
      return false;
    }
  }

  private get FormattedDate(): string {
    return moment(this.Mission?.created_at).format("DD-MM-YYYY HH:mm");
  }

  private onDelete() {
    this.$emit("onDelete", this.Mission?.id);
  }

  private async onCancel() {
    store.dispatch('MissionAnimation/UpdateLoading', true);
    await store.dispatch('Missions/CancelMission', this.Mission?.id);
    store.dispatch('MissionAnimation/UpdateLoading', false);
  }
}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../../css/tooltip.css';
  @import '../../css/loader.css';

  .tool {
    font-size: 0.75em;
  }

  .Complete {
    background-color: rgba(0, 255, 0, 0.6) !important;
    color: black;
  }

  .Queued {
    background-color: rgba(255, 0, 0, 0.6) !important;
    color: black;
  }

  .Processing {
    background-color: rgba(255, 166, 0, 0.6) !important;
    color: black;
  }

  .Cancelling {
    background-color: yellow !important;
    color: black;
  }

  .Cancelled {
    background-color: grey !important;
    color: white;
  }

  .Error {
    background-color: purple !important;
    color: white;
  }

  .mission-link{
    cursor: pointer;
    margin: 0.5em;
    font-size: 0.75em;
    transition: 0.3s;
    color: black;
  }

  .mission-link:hover{
    color: lightgrey;
  }

  sup {
    font-size: xx-small;
  }

  .create-copy {
    font-size: 1.3em;
    color: #888;
  }

  .play {
    font-size: 1.5em;
    color: #888;
  }

  .delete {
    color: #888;
    font-size: 1.4em;
  }

  .cancel {
    color: #888;
    font-size: 1.4em;
  }
</style>

