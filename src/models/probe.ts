import * as Three from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import IBody from './body';
import Trajectory from './trajectory';
import Store from '@/store';


export default class Probe implements IBody{
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
        window.console.log(`Probe.load()`)
        await this.LoadGLTF();

        if (this.gltfScene) {
            scene.add(this.gltfScene);

            if (this.id in Store.state.CsvByBodyId) {
                this.trajectory = new Trajectory(Store.state.CsvByBodyId[this.id], "green");
                this.trajectory.load(scene);
            }
        }
    }

    public animate() {
        if (this.gltfScene) {
            this.gltfScene.rotation.x += 0.02;
            this.gltfScene.rotation.y += 0.02;
            this.gltfScene.rotation.z += 0.02;

            if (this.trajectory) {
                const node = this.trajectory.getNextNode();
                this.gltfScene.position.x = node.vector.x;
                this.gltfScene.position.y = node.vector.y;
                this.gltfScene.position.z = node.vector.z;
            }
        }
    }

    private async LoadGLTF(): Promise<void> {
        const promise = await new Promise<void>((resolve) => {

            new GLTFLoader().load('/assets/probe/scene.gltf', (gltf) => {
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