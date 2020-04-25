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
        let bodyData = new Array<string>();

        for (const row of response.split("\n")) {
            if (row && row.trim().length > 0) {
                if (row.startsWith('#END#')) {
                    window.console.log('end of body data');
                    data[id] = bodyData;
                } else if (row.length < 10) {
                    id = row;
                    bodyData = new Array<string>();
                } else {
                    bodyData.push(row);
                }
            }
        }

        context.commit('setCsvByBodyId', data);
    },
};

export default actions;