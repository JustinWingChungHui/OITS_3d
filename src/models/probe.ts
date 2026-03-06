import * as Three from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type Body from './body';
import Trajectory from './trajectory';
import SphericalBody from './spherical_body';
import AnimationState from './animation_state';
import ResourceTracker from './scene_builders/resource-tracker';
import { MissionState } from '@/models/missions/mission_state';
import { useUserSettingsStore } from '@/stores/user-settings';
import { toRaw } from 'vue';

export default class Probe implements Body{

    public id: string;
    public x: number;
    public y: number;
    public z: number;
    public scale: number;
    public colour: string;
    public trajectory: Trajectory | null = null;

    public texture: Three.Texture | null = null;
    private gltfScene: Three.Group | null = null;

    private userSettingsStore: ReturnType<typeof useUserSettingsStore> | null = null;


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
        console.log(`Probe.load()`)
        this.userSettingsStore = useUserSettingsStore();

        await this.LoadGLTF();

        const trajectoryByBodyId = MissionState.trajectoryByBodyId;

        if (this.id in trajectoryByBodyId) {
            this.trajectory = trajectoryByBodyId[this.id]!;
            this.trajectory.line.material = ResourceTracker.track(new Three.LineBasicMaterial({
                color: toRaw(this.userSettingsStore.data.probeTrajectoryColor)
            }));

            this.trajectory.showPastOnly();
            this.trajectory.load(scene);

            this.x = this.trajectory.currentNode.vector.x;
            this.y = this.trajectory.currentNode.vector.y;
            this.z = this.trajectory.currentNode.vector.z;

            const deltaT = this.trajectory.nodes[1]!.t - this.trajectory.nodes[0]!.t;
    
            const r = this.trajectory.currentNode.GetDistanceFromOrigin()
            MissionState.deltaT = deltaT;
            MissionState.distanceFromSun = r;
            MissionState.probeSpeed = this.trajectory.currentNode.speed;
        }

        if (this.gltfScene) {
            scene.add(this.gltfScene);
        }

        console.log(`Probe.loaded`)
    }

    public animate() {
        this.animateAndGetTime();
    }

    public animateAndGetTime(): number {
        if (this.gltfScene && this.userSettingsStore) {
            if (this.trajectory) {
                const node = this.trajectory.getNextNode();
                this.gltfScene.position.x = node.vector.x;
                this.gltfScene.position.y = node.vector.y;
                this.gltfScene.position.z = node.vector.z;

                const r = node.GetDistanceFromOrigin()
                MissionState.distanceFromSun = r;

                if (node.speed) {
                    MissionState.probeSpeed = node.speed;
                }

                if (this.trajectory.isLastNode) {
                    MissionState.animationState = AnimationState.paused;
                }

                this.trajectory.animate();

                return node.t;
            }
        }

        return 0;
    }

    public pointTowardsBody(body: SphericalBody) {

        if (this.gltfScene && body.sphere && MissionState.IsAnimating()) {
            this.gltfScene.lookAt(body.sphere.position);
        }
    }

    private async LoadGLTF(): Promise<void> {
        const promise = await new Promise<void>((resolve) => {

            new GLTFLoader().load('/probe/scene.gltf', (gltf) => {

                ResourceTracker.track(gltf)
                const size = this.scale * toRaw(this.userSettingsStore!.data.probeSizeMultiple);

                gltf.scene.scale.set(size, size, size);
                gltf.scene.position.x = this.x;
                gltf.scene.position.y = this.y;
                gltf.scene.position.z = this.z;
                this.gltfScene = ResourceTracker.track(gltf.scene);

                this.gltfScene.traverse((child) => {
                    if (child instanceof Three.Mesh) {
                        const mesh = child as Three.Mesh;
                        
                        // Texture is not showing up , so use basic colour
                        mesh.material = ResourceTracker.track(new Three.MeshLambertMaterial({
                            color: toRaw(this.userSettingsStore!.data.probeColor)
                        }));
                    }
                });

                resolve();
            });
        })
        .catch(err => {throw err});
    
        return promise;
    }
}