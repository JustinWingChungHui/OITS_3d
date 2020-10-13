<template>
    <div>
        <div id="settingsModal" style="display:none">
            <div class="settings-container">
                <h2>Settings</h2>
                <form class="pure-form pure-form-aligned">
                    <fieldset>
                        <div class="pure-control-group">
                            <label for="aligned-name">Background</label>
                            <select v-model="settingsData.background">
                                <option>Milky Way</option>
                                <option>Universe</option>
                                <option>Psychedelic</option>
                                <option>Space</option>
                                <option>White</option>
                                <option>Grey</option>
                                <option>Black</option>
                            </select>
                        </div>
                        <div class="pure-control-group">
                            <label for="aligned-foo">Supercalifragilistic Label</label>
                            <input type="text" id="aligned-foo" placeholder="Enter something here..." />
                        </div>
                        <div class="pure-controls">
                             <button class="pure-button pure-button-primary" @click="save">Save</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
        <div class="modal">
            <div class="modal-inner">
                <span data-modal-close>&times;</span>
                <div class="modal-content"></div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import VanillaModal from 'vanilla-modal';
import store from '@/store';
import UserSettings from '@/store/userSettings';

@Component
export default class Settings extends Vue {

    public modal?: VanillaModal;

    public settingsData: UserSettings = store.state.userSettings;

    protected mounted() {
        this.modal = new VanillaModal();
        store.dispatch('loadSettings')

        this.settingsData = store.state.userSettings;
    }

    public show() {
        window.console.log(`show()`);
        if (this.modal) {
            this.modal.open('#settingsModal');
        }
    }

    public save() {
        store.dispatch('saveSettings')
    }
}

</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.settings-container {
    padding: 15px;
}
.vanilla-modal .modal {
  display: block;
  position: fixed;
  content: "";
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.2s, z-index 0s 0.2s;
  text-align: center;
  overflow: hidden;
  overflow-y: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.vanilla-modal .modal > * {
  display: inline-block;
  white-space: normal;
  vertical-align: middle;
  text-align: left;
}

.vanilla-modal .modal:before {
  display: inline-block;
  overflow: hidden;
  width: 0;
  height: 100%;
  vertical-align: middle;
  content: "";
}

.vanilla-modal.modal-visible .modal {
  z-index: 99;
  opacity: 1;
  transition: opacity 0.2s;
}

.modal-inner {
  position: relative;
  overflow: hidden;
  max-width: 90%;
  max-height: 90%;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;
  z-index: -1;
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.2s, transform 0.2s, z-index 0s 0.2s;
}
.modal-visible .modal-inner {
  z-index: 100;
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.2s, transform 0.2s;
}

[data-modal-close] {
  position: absolute;
  z-index: 2;
  right: 0;
  top: 0;
  width: 25px;
  height: 25px;
  line-height: 25px;
  font-size: 13px;
  cursor: pointer;
  text-align: center;
  background: #fff;
  box-shadow: -1px 1px 2px rgba(0,0,0,0.2);
}
</style>

