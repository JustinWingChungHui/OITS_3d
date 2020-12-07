export default interface MissionParams {
    BSP: string[];
    Duration: number;
    ID: string[];
    NIP: number;
    Nbody: number;
    Ndata: number;
    PROGRADE_ONLY: boolean;
    Periacon: number[];
    Perihcon: number[];
    RENDEZVOUS: boolean;
    RUN_TIME: number;
    dVcon: number[];
    rIP: number[];
    t0: number[];
    t01: string;
    thetaIP: number[];
    thetalb: number[];
    thetaub: number[];
    thiIP: number[];
    thilb: number[];
    thiub: number[];
    tmax: number[];
    tmax1: string;
    tmin: number[];
    tmin1: string;
    trajectory_optimization: boolean;
}