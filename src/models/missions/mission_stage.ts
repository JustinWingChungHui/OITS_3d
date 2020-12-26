import config from '@/config';

export default class MissionStage {
    ID: string;
    IdDescription: string;

    constructor(ID: string) {
        this.ID = ID;
        if (ID) {
            this.IdDescription = config.bodiesByNAIFCodes[ID];
        } else {
            this.IdDescription = '';
        }
    }
}