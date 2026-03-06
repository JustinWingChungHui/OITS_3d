import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useLoadingStateStore = defineStore('loading-state', () => {
    const loading = ref(false);

    return { loading}
})