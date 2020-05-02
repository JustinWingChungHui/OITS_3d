import StateInterface from "./state_interface";
import AnimationState from '@/models/animation_state';


const state: StateInterface = {
  uid: '',
  TrajectoryByBodyId: {},
  t: 0,
  deltaT: 1,
  animationState: AnimationState.paused,
  loading: true,
}

export default state;