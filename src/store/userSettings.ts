export default interface UserSettings {
    background: string;
    probeSizeMultiple: number;
    bodySizeMultiple: number;
    markerSizeMultiple: number;
    asteroidSizeMultiple: number;
    planetTrajectoryColor: string;
    probeTrajectoryColor: string;
    probeColor: string;
    asteroidTrajectoryColor: string;
    cameraTracksProbe: boolean;

    lastUpdatedDate: Date;
}