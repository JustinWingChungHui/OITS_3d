import StateInterface from "./state_interface";
import AnimationState from '@/models/animation_state';


const state: StateInterface = {
  uid: '',
  TrajectoryByBodyId: {},
  t: 0,
  deltaT: 1,
  animationState: AnimationState.paused,
  loading: true,
  playbackSpeed: 1,
  userSettings: {
    background: 'Universe',
    bodySizeMultiple: 10,
    probeSizeMultiple: 10,
    markerSizeMultiple: 10,
    asteroidSizeMultiple: 10,
    planetTrajectoryColor: 'blue',
    probeTrajectoryColor: 'white',
    probeColor: 'white',
    asteroidTrajectoryColor: 'red',
    cameraTracksProbe: true,

    lastUpdatedDate: new Date(),
  }
}

export default state;