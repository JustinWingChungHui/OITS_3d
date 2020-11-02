export interface MissionResponse {
    model: string;
    pk: number;
    fields: Fields;
}

export interface Fields {
    uid: string;
    description: string;
    status: string;
    created_at: Date;
}




