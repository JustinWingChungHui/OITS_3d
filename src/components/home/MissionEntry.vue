<template>
    <tr>
        <td>{{ Mission.pk }}</td>
        <td>{{ Mission.fields.description }}</td>
        <td>{{ Mission.fields.status }}</td>
        <td>{{ Mission.fields.created_at }}</td>
    </tr>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import store from '@/store';
import { MissionResponse } from '@/models/missions/missions_response';
import Mission from './Mission.vue';

@Component({
  components: {
  },
})
export default class MissionEntry extends Vue { 
  @Prop({default: null})
  public Mission?: MissionResponse;
}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

