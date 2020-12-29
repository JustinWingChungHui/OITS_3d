<template>
    <tr>
        <td>{{ Mission.id }}</td>
        <td>{{ Mission.description }}</td>
        <td>{{ FormattedDate }}</td>
        <td :class="StatusDescription">
          <i v-if="Mission.status === 'P'" class="c-inline-spinner"></i>
          {{ StatusDescription }}
        </td>
        <td>
          <span class="tool" data-tip="Create Copy & Edit">
            <router-link class="mission-link create-copy" :to="{ path: `/edit/${Mission.id}` }">
                <sup><span class="oi" data-glyph="plus"></span></sup>
                <span class="oi" data-glyph="file"></span>
            </router-link>
          </span>

          <span v-if="Mission.readonly === false" class="tool" data-tip="Delete Mission">
              <span class="oi mission-link delete" data-glyph="trash" @click="onDelete"></span>
          </span>

          <span class="tool" data-tip="Play Mission Animation">
            <router-link class="mission-link play" v-if="Mission.status === 'C'" :to="{ path: '/animation', query: { uid: Mission.uid }}">
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
    'P': 'Processing'
  };

  public get StatusDescription(): string {
    if (this.Mission?.status) {
      return this.StatusMap[this.Mission?.status];
    } else {
      return '';
    }
  }

  private get FormattedDate(): string {
    return moment(this.Mission?.created_at).format("DD-MM-YYYY HH:mm");
  }

  private onDelete() {
    this.$emit("onDelete", this.Mission?.id);
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
</style>

