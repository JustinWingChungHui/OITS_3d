import * as Three from 'three'
import type Body from './body';
import Trajectory from './trajectory';
import ResourceTracker from './scene_builders/resource-tracker';
import { MissionState } from '@/models/missions/mission_state';
import { useUserSettingsStore } from '@/stores/user-settings';
import { toRaw } from 'vue';


export default class SphericalBody implements Body{

    // Decentish smoothness and performance
    public static WIDTH_SEGMENTS = 24;
    public static HEIGHT_SEGMENTS = 16;

    public id: string;
    public x: number;
    public y: number;
    public z: number;
    public texture: Three.Texture | null = null;
    public radius: number;
    public trajectory: Trajectory | null = null;
    public sphere: Three.Mesh | null = null;

    private textureFile: string;
    private rotationSpeed: number;

    private userSettingsStore: ReturnType<typeof useUserSettingsStore> | null = null;


    constructor(id: string,
                x: number,
                y: number,
                z: number,
                radius: number,
                texture: string,
                rotationSpeed: number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.textureFile = texture;
        this.rotationSpeed = rotationSpeed;
    }

    public animate() {
        if (this.sphere) {

            if (MissionState.IsAnimating()) {
                this.sphere.rotation.y += this.rotationSpeed;
            }

            if (this.trajectory) {
                const node = this.trajectory.getNodeForCurrentTime();
                this.sphere.position.x = node.vector.x;
                this.sphere.position.y = node.vector.y;
                this.sphere.position.z = node.vector.z;
                this.trajectory.animate();
            }
        }
    }


    public async load(scene: Three.Scene): Promise<void> {
        console.log(`SphericalBody.load()`)
    
        this.userSettingsStore = useUserSettingsStore();

        await this.loadTexture();

        const trajectoryByBodyId = toRaw(MissionState.trajectoryByBodyId);

        if (this.id in trajectoryByBodyId) {
            this.trajectory = trajectoryByBodyId[this.id]!;
            this.trajectory.line.material = ResourceTracker.track(new Three.LineBasicMaterial({ 
                color: toRaw(this.userSettingsStore.data.planetTrajectoryColor)
            }));

            this.trajectory.load(scene);

            this.x = this.trajectory.currentNode.vector.x;
            this.y = this.trajectory.currentNode.vector.y;
            this.z = this.trajectory.currentNode.vector.z;
        }

        const size = this.radius * toRaw(this.userSettingsStore.data.bodySizeMultiple);

        const sphereGeometry = ResourceTracker.track(new Three.SphereGeometry(
                        size, SphericalBody.WIDTH_SEGMENTS, SphericalBody.HEIGHT_SEGMENTS)); 

        const sphereMaterial = ResourceTracker.track(new Three.MeshBasicMaterial( {map: this.texture} )); 
        this.sphere = ResourceTracker.track(new Three.Mesh(sphereGeometry, sphereMaterial));
        this.sphere.position.set(this.x, this.y, this.z);
        this.sphere.rotation.x += Math.PI / 2;

        scene.add(this.sphere);
    }

    private async loadTexture(): Promise<void> {
        const promise = await new Promise<void>((resolve) => {

            new Three.TextureLoader().load(this.textureFile, (texture) => {
                this.texture = ResourceTracker.track(texture);
                resolve();
            });
        })
        .catch(err => {throw err});
    
        return promise;
    }
}