<template>
    <div>
        <table class="pure-table pure-table-striped result-list">
             <thead>
            <tr>
              <th>Description</th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in results" :key="result.name">
              <td>{{ result.name }}</td>
              <td>{{ result.createdAt }}</td>
              <td>
                <span class="tool" data-tip="Play Mission Animation">
                <router-link class="play" :to="{ path: `/animation/${result.urlBase64}` }">
                    <span class="oi" data-glyph="media-play"></span>
                </router-link>
              </span>
            </td>
            </tr>
          </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import config from '@/config';
import axios from 'axios';
import { type RawAxiosRequestConfig, AxiosHeaders } from 'axios';
import { parseString } from 'xml2js';
import type Result from '@/models/results/result';
import 'open-iconic/font/css/open-iconic.css';
import { useLoadingStateStore } from '@/stores/loading-state';

const loadingStateStore = useLoadingStateStore();

const results = ref<Result[]>([]);

onMounted(async() => {
  loadingStateStore.loading = true;
  results.value = [];
  const uri = `${config.resultsListUrl}`;

  const headers = new AxiosHeaders();
  headers.setAccept('application/xml');
  const reqConfig: RawAxiosRequestConfig = {
    headers
  };
  const response = await axios.get<string>(uri, reqConfig);
  parseString(response.data, (error, result) => {
    console.log('error', error);
    console.log('result', result);
    for (const blob of result.EnumerationResults.Blobs[0].Blob) {
      console.log('blob', blob);
      const result: Result = {
        name: blob.Name[0],
        createdAt: blob.Properties[0]['Last-Modified'][0],
        url: blob.Url[0],
        urlBase64: btoa(blob.Url[0])
      };

      results.value.push(result);
    }
    console.log('results loaded');
    loadingStateStore.loading = false;
  });
  
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../../css/modal.css';
@import '../../css/tooltip.css';
@import '../../css/loader.css';
.result-list {
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
}

.play{
  cursor: pointer;
  margin: 0.5em;
  transition: 0.3s;
  font-size: 1.5em;
  color: #888;
}

p {
    max-width: 960px;
    margin: 0 auto;
    padding: 1em;
    text-align: center;
    border-bottom: 1px solid #eee;
}
</style>
    
    