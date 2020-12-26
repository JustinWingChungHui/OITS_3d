import * as Three from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import IBody from './body';
import Trajectory from './trajectory';
import store from '@/store';
import ResourceTracker from '../scene_builders/resource-tracker';
import MissionAnimation from '@/store/mission-animation';


export default class Asteroid implements IBody{
    public id: string;
    public x: number;
    public y: number;
    public z: number;
    public scale: number;
    public trajectory: Trajectory | null = null;

    private gltfScene: Three.Group | null = null;

    constructor(id: string,
                x: number,
                y: number,
                z: number,
                scale: number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.scale = scale;
    }

    public async load(scene: Three.Scene): Promise<void> {
        window.console.log(`Asteroid.load()`)

        await this.LoadGLTF();


        const trajectoryByBodyId = (store.state.MissionAnimation as MissionAnimation).TrajectoryByBodyId

        if (this.id in trajectoryByBodyId) {
            this.trajectory = trajectoryByBodyId[this.id];
            
            this.trajectory.line.material = ResourceTracker.track(new Three.LineBasicMaterial({ 
                color: store.state.UserSettings.Data.asteroidTrajectoryColor 
            }));

            this.trajectory.load(scene);

            this.x = this.trajectory.currentNode.vector.x;
            this.y = this.trajectory.currentNode.vector.y;
            this.z = this.trajectory.currentNode.vector.z;
        }

        if (this.gltfScene) {
            scene.add(this.gltfScene);
        }
    }

    public animate() {
        if (this.gltfScene) {


            if (store.getters['MissionAnimation/IsAnimating']) {
                this.gltfScene.rotation.y += 0.02;
            }

            if (this.trajectory) {
                const node = this.trajectory.getNodeForCurrentTime();
                this.gltfScene.position.x = node.vector.x;
                this.gltfScene.position.y = node.vector.y;
                this.gltfScene.position.z = node.vector.z;
                this.trajectory.animate();
            }
        }
    }

    private async LoadGLTF(): Promise<void> {
        const promise = await new Promise<void>((resolve) => {

            new GLTFLoader().load('/assets/asteroid/scene.gltf', (gltf) => {
                ResourceTracker.track(gltf)
                const size = this.scale * store.state.UserSettings.Data.asteroidSizeMultiple;
                gltf.scene.scale.set(size, size, size);
                gltf.scene.position.x = this.x;
                gltf.scene.position.y = this.y;
                gltf.scene.position.z = this.z;
                
                this.gltfScene = ResourceTracker.track((gltf.scene));
                resolve();
            });
        })
        .catch(err => {throw err});
    
        return promise;
    }
}