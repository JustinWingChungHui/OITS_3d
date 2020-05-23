import * as Three from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import IBody from './body';
import Trajectory from './trajectory';
import Store from '@/store';
import store from '@/store';
import config from '@/config';

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

        if (this.id in Store.state.TrajectoryByBodyId) {
            this.trajectory = Store.state.TrajectoryByBodyId[this.id];
            this.trajectory.line.material = new Three.LineBasicMaterial({ 
                color: config.asteroidTrajectoryColor 
            });
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

            if (store.getters.isAnimating) {
                this.gltfScene.rotation.x += 0.02;
                this.gltfScene.rotation.y += 0.02;
                this.gltfScene.rotation.z += 0.02;
            }

            if (this.trajectory) {
                const node = this.trajectory.getNodeForCurrentTime();
                this.gltfScene.position.x = node.vector.x;
                this.gltfScene.position.y = node.vector.y;
                this.gltfScene.position.z = node.vector.z;
            }
        }
    }

    private async LoadGLTF(): Promise<void> {
        const promise = await new Promise<void>((resolve) => {

            new GLTFLoader().load('/assets/asteroid/scene.gltf', (gltf) => {
                gltf.scene.scale.set(this.scale, this.scale, this.scale);
                gltf.scene.position.x = this.x;
                gltf.scene.position.y = this.y;
                gltf.scene.position.z = this.z;
                
                this.gltfScene = gltf.scene;
                resolve();
            });
        })
        .catch(err => {throw err});
    
        return promise;
    }
}