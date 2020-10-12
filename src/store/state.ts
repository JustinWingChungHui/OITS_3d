import StateInterface from "./state_interface";
import AnimationState from '@/models/animation_state';


const state: StateInterface = {
  uid: '',
  TrajectoryByBodyId: {},
  t: 0,
  deltaT: 1,
  animationState: AnimationState.paused,
  loading: true,
  userSettings: {
    background: 'Universe',
    playbackSpeed: 1,
    bodySizeMultiple: 1,
    probeSizeMultiple: 1,
    markerSizeMultiple: 1,
    planetTrajectoryColor: 'blue',
    probeTrajectoryColor: 'white',
    asteroidTrajectoryColor: 'red',

    // Brightness
    light: 3.2,
  }
}

export default state;