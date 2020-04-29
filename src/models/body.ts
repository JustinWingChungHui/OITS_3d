import * as Three from 'three'
import Trajectory from './trajectory';

// https://sketchfab.com/3d-models?features=downloadable&sort_by=-likeCount
export default interface Body {
    id: string;
    trajectory: Trajectory | null;

    load(scene: Three.Scene): Promise<void>;
    animate(t: number): void;
}