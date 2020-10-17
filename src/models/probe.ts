import * as Three from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import IBody from './body';
import Trajectory from './trajectory';
import SphericalBody from './spherical_body';
import store from '@/store';
import AnimationState from './animation_state';
import state from '@/store/state';


export default class Probe implements IBody{
    public id: string;
    public x: number;
    public y: number;
    public z: number;
    public scale: number;
    public colour: string;
    public trajectory: Trajectory | null = null;

    public texture: Three.Texture | null = null;
    private gltfScene: Three.Group | null = null;

    constructor(id: string,
                x: number,
                y: number,
                z: number,
                colour: string,
                scale: number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        // Invert the object so that the lookat function makes probe look in opposite direction
        this.scale = -scale;
        this.colour = colour
    }


    public async load(scene: Three.Scene): Promise<void> {
        window.console.log(`Probe.load()`)
        await this.LoadGLTF();

        if (this.id in store.state.TrajectoryByBodyId) {
            this.trajectory = store.state.TrajectoryByBodyId[this.id];
            this.trajectory.line.material = new Three.LineBasicMaterial({
                color: store.state.userSettings.probeTrajectoryColor
            });
            this.trajectory.showPastOnly();
            this.trajectory.load(scene);

            this.x = this.trajectory.currentNode.vector.x;
            this.y = this.trajectory.currentNode.vector.y;
            this.z = this.trajectory.currentNode.vector.z;

            const deltaT = this.trajectory.nodes[1].t - this.trajectory.currentNode.t;
            store.dispatch('setDeltaT', deltaT);
        }

        if (this.gltfScene) {
            scene.add(this.gltfScene);
        }
    }

    public animate() {
        this.animateAndGetTime();
    }

    public animateAndGetTime(): number {
        if (this.gltfScene) {
            if (this.trajectory) {
                const node = this.trajectory.getNextNode();
                this.gltfScene.position.x = node.vector.x;
                this.gltfScene.position.y = node.vector.y;
                this.gltfScene.position.z = node.vector.z;

                if (this.trajectory.isLastNode) {
                    store.dispatch('setAnimationState', AnimationState.paused);
                }

                this.trajectory.animate();

                return node.t;
            }
        }

        return 0;
    }

    public pointTowardsBody(body: SphericalBody) {
        if (this.gltfScene && body.sphere && store.getters.isAnimating) {
            this.gltfScene.lookAt(body.sphere.position);
        }
    }

    private async LoadGLTF(): Promise<void> {
        const promise = await new Promise<void>((resolve) => {

            new GLTFLoader().load('/assets/probe/scene.gltf', (gltf) => {
                const size = this.scale * store.state.userSettings.probeSizeMultiple;
                gltf.scene.scale.set(size, size, size);
                gltf.scene.position.x = this.x;
                gltf.scene.position.y = this.y;
                gltf.scene.position.z = this.z;
                this.gltfScene = gltf.scene;

                this.gltfScene.traverse((child) => {
                    if (child instanceof Three.Mesh) {
                        const mesh = child as Three.Mesh;
                        
                        // Texture is not showing up , so use basic colour
                        mesh.material = new Three.MeshBasicMaterial({
                            color: this.colour,
                        });
                    }
                });

                resolve();
            });
        })
        .catch(err => {throw err});
    
        return promise;
    }
}