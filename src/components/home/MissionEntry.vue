<template>
    <tr>
        <td>{{ Mission.id }}</td>
        <td>{{ Mission.description }}</td>
        <td :class="StatusDescription">{{ StatusDescription }}</td>
        <td>{{ FormattedDate }}</td>
        <td>
          <router-link :to="{ path: '/edit', query: {id: Mission.id } }">
            <span class="oi mission-link" data-glyph="pencil"></span>
          </router-link>
          
          <router-link :to="{ path: '/animation', query: { uid: Mission.uid }}" target="_blank">
            <span class="oi mission-link" data-glyph="media-play"></span>
          </router-link>
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
    'N': 'New',
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
}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .Complete {
    color: darkgreen !important;
  }

  .New {
    color: darkred !important;
  }

  .Processing {
    color: orange !important;
  }

  .mission-link{
    cursor: pointer;
    margin: 0.75em;
    font-size: 1.25em;
    transition: 0.3s;
    color: black;
  }

  .mission-link:hover{
    color: lightgrey;
  }
</style>

