import Trajectory from '@/models/trajectory';
import AnimationState from '@/models/animation_state';
import UserSettings from './userSettings';


export default interface StateInterface {
  uid: string;
  TrajectoryByBodyId: { [id: string]: Trajectory };
  t: number;
  deltaT: number;
  animationState: AnimationState;
  loading: boolean;
  playbackSpeed: number;
  userSettings: UserSettings;
}