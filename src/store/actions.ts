import { ActionTree } from 'vuex';
import StateInterface from './state_interface';
import * as request from 'request-promise-native';

import config from '@/config';

const actions: ActionTree<StateInterface, StateInterface> = {

    async setUid(context, uid: string) {

        if (!uid) {
            context.commit('setUid', uid);
            context.commit('setCsvByBodyId', {});
        }
        else if (uid !== context.state.uid) {

            context.commit('setUid', uid);

            // refresh results data
            await context.dispatch('getCsvResults');
        }
    },

    async getCsvResults(context) {
        window.console.log('getCsvResults() action called');
        
        const path = config.CsvResults.replace(`{uid}`, context.state.uid);

        const options = {
            uri: `${config.BaseUrl}${path}`
        }

        const response = await request.get(options) as string;

        const data: { [id: string]: string[] } = {};

        let id = '';

        for (const row of response.split("\n")) {
            if (row && row.trim().length > 0) {
                if (!row.includes(',')) {
                    id = row;
                    data[id] = new Array<string>();

                } else {
                    data[id].push(row);
                }
            }
        }

        context.commit('setCsvByBodyId', data);
    },
};

export default actions;