<template>
 <div>
      <div id="missionDeleteModal" style="display:none;">
        <div class="missionDeleteModalContent">
          <h2>Delete Mission</h2>
          <div class="pure-form pure-form-aligned">
              Are you sure you want to delete mission?
              <i v-if="waiting" class="c-inline-spinner"></i>
              <div class="pure-controls">
                <button class="pure-button pure-button-primary delete-button" @click="onDelete" :disabled="waiting">Delete</button>
                <button class="pure-button pure-button-primary cancel-button" @click="onCancel" :disabled="waiting">Cancel</button>
              </div>
          </div>
        </div>
      </div>
      <div class="modal">
            <div class="modal-inner">
                <div class="modal-content"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import VanillaModal, { VanillaModalConfig } from 'vanilla-modal';
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';

@Component({
  components: {
  },
})
export default class MissionDelete extends Vue { 

  public modal?: VanillaModal;

  public missionId = 0;
  public missionDescription = '';

  public waiting = false;

  public show(missionId: number) {
    this.missionId = missionId;

    
    if (this.modal) {
      this.modal.open('#missionDeleteModal');
    }
  }

  protected async mounted() {

    const options: VanillaModalConfig = {
      clickOutside: false
    };
    
    this.modal = new VanillaModal(options);
  }

  private async onDelete() {
    this.waiting = true;
    await store.dispatch('Missions/DeleteMission', this.missionId);
    this.waiting = false;

    if (this.modal) {
      this.modal.close();
    }
  }

  private onCancel() {
    if (this.modal) {
      this.modal.close();
    }
  }
}

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../../css/modal.css';
@import '../../css/loader.css';

.missionDeleteModalContent {
  margin: 1em;
}

.delete-button,
.cancel-button {
  margin: 0.25em;
  border-radius: 4px;
}

.delete-button {
  background: rgb(202, 60, 60);
}

.cancel-button {
  background: rgb(66, 184, 221);
}
</style>

