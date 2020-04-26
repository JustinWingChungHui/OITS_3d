import * as Three from 'three'
import Trajectory from './trajectory';

export default interface Body {
    id: string;
    trajectory: Trajectory | null;

    load(scene: Three.Scene): Promise<void>;
    animate(): void;
}