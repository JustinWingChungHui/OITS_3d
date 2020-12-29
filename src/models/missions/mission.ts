import MissionParams from '@/models/missions/mission_params';

export default interface Mission {
    id: number;
    uid: string;
    description: string;
    status: string;
    parameters: string;
    created_at: Date;
    objectParameters: MissionParams;
    readonly: boolean;
}




