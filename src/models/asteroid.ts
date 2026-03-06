import * as Three from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type Body from './body';
import Trajectory from './trajectory';
import ResourceTracker from './scene_builders/resource-tracker';
import { MissionState } from '@/models/missions/mission_state';
import { useUserSettingsStore } from '@/stores/user-settings';
import { toRaw } from 'vue';

export default class Asteroid implements Body{
    public id: string;
    public x: number;
    public y: number;
    public z: number;
    public scale: number;
    public trajectory: Trajectory | null = null;

    private gltfScene: Three.Group | null = null;
    private userSettingsStore: ReturnType<typeof useUserSettingsStore> | null = null;

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
        console.log(`Asteroid.load()`)

        this.userSettingsStore = useUserSettingsStore();
        await this.LoadGLTF();
        const trajectoryByBodyId = MissionState.trajectoryByBodyId;

        if (this.id in trajectoryByBodyId) {
            this.trajectory = trajectoryByBodyId[this.id]!;
            
            if (this.trajectory) {
                this.trajectory.line.material = ResourceTracker.track(new Three.LineBasicMaterial({ 
                    color: toRaw(this.userSettingsStore.data.asteroidTrajectoryColor) 
                }));

                this.trajectory.load(scene);

                this.x = this.trajectory.currentNode.vector.x;
                this.y = this.trajectory.currentNode.vector.y;
                this.z = this.trajectory.currentNode.vector.z;
            }
        }

        if (this.gltfScene) {
            scene.add(this.gltfScene);
        }
    }

    public animate() {
        if (this.gltfScene && this.userSettingsStore) {


            if (MissionState.IsAnimating()) {
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
        const userSettingsStore = useUserSettingsStore();

        const promise = await new Promise<void>((resolve) => {

            new GLTFLoader().load('/asteroid/scene.gltf', (gltf) => {
                ResourceTracker.track(gltf)
                const size = this.scale * toRaw(userSettingsStore.data.asteroidSizeMultiple);
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