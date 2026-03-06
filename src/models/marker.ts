import * as Three from 'three'
import type Body from './body';
import Trajectory from './trajectory';
import ResourceTracker from './scene_builders/resource-tracker';
import { MissionState } from '@/models/missions/mission_state';
import { useUserSettingsStore } from '@/stores/user-settings';
import { toRaw } from 'vue';

export default class Marker implements Body{
    public id: string;
    public x: number;
    public y: number;
    public z: number;
    public size: number;
    public trajectory: Trajectory | null = null;

    private cone1: Three.Mesh | null = null;
    private cone2: Three.Mesh | null = null;
    private cone3: Three.Mesh | null = null;
    private cone4: Three.Mesh | null = null;
    private cone5: Three.Mesh | null = null;
    private cone6: Three.Mesh | null = null;

    private narrowness = 3;

    private userSettingsStore: ReturnType<typeof useUserSettingsStore> | null = null;


    constructor(id: string,
                x: number,
                y: number,
                z: number,
                size: number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.size = size;
    }

    public animate() {
        // Resize
        if (this.trajectory && this.cone1 && this.cone2 
                && this.cone3 && this.cone4
                && this.cone5 && this.cone6 
                && this.userSettingsStore) {
            const size = this.size * this.userSettingsStore.data.markerSizeMultiple;
            const node = this.trajectory.getNextNode();
            this.cone1.position.x = node.vector.x;
            this.cone1.position.y = node.vector.y - this.narrowness * size;
            this.cone1.position.z = node.vector.z;
            this.cone2.position.x = node.vector.x;
            this.cone2.position.y = node.vector.y;
            this.cone2.position.z = node.vector.z - this.narrowness * size;
            this.cone3.position.x = node.vector.x;
            this.cone3.position.y = node.vector.y + this.narrowness * size;
            this.cone3.position.z = node.vector.z;
            this.cone4.position.x = node.vector.x;
            this.cone4.position.y = node.vector.y;
            this.cone4.position.z = node.vector.z + this.narrowness * size;
            this.cone5.position.x = node.vector.x + this.narrowness * size;
            this.cone5.position.y = node.vector.y;
            this.cone5.position.z = node.vector.z;
            this.cone6.position.x = node.vector.x - this.narrowness * size;
            this.cone6.position.y = node.vector.y;
            this.cone6.position.z = node.vector.z;
        }
    }


    public async load(scene: Three.Scene): Promise<void> {
        console.log(`Marker.load()`)

        this.userSettingsStore = useUserSettingsStore();

        const trajectoryByBodyId = MissionState.trajectoryByBodyId;

        if (this.id in trajectoryByBodyId) {
            this.trajectory = trajectoryByBodyId[this.id]!;
            this.trajectory.line.material = ResourceTracker.track(new Three.LineBasicMaterial( { color: 'gray' } ));

            this.trajectory.load(scene);

            this.x = this.trajectory.currentNode.vector.x;
            this.y = this.trajectory.currentNode.vector.y;
            this.z = this.trajectory.currentNode.vector.z;
        }

        const size = this.size * toRaw(this.userSettingsStore.data.markerSizeMultiple);

        const coneGeometry = ResourceTracker.track(new Three.ConeGeometry(size, size * this.narrowness * 2, 8)); 

        const coneMaterial = ResourceTracker.track(new Three.MeshBasicMaterial( {
            color: toRaw(this.userSettingsStore.data.markerColor)
        } ));

        this.cone1 = ResourceTracker.track(new Three.Mesh(coneGeometry, coneMaterial));
        this.cone2 = ResourceTracker.track(new Three.Mesh(coneGeometry, coneMaterial));
        this.cone3 = ResourceTracker.track(new Three.Mesh(coneGeometry, coneMaterial));
        this.cone4 = ResourceTracker.track(new Three.Mesh(coneGeometry, coneMaterial));
        this.cone5 = ResourceTracker.track(new Three.Mesh(coneGeometry, coneMaterial));
        this.cone6 = ResourceTracker.track(new Three.Mesh(coneGeometry, coneMaterial));

        this.cone1.position.set(this.x, this.y, this.z);
        this.cone2.position.set(this.x, this.y, this.z);
        this.cone3.position.set(this.x, this.y, this.z);
        this.cone4.position.set(this.x, this.y, this.z);
        this.cone5.position.set(this.x, this.y, this.z);
        this.cone6.position.set(this.x, this.y, this.z);

        this.cone1.rotation.set(0, 0, 0);
        this.cone2.rotation.set(Math.PI / 2, 0, 0);
        this.cone3.rotation.set(Math.PI, 0, 0);
        this.cone4.rotation.set(3 * Math.PI / 2, 0, 0);
        this.cone5.rotation.set(0, 0, Math.PI / 2);
        this.cone6.rotation.set(0, 0, 3 * Math.PI / 2);

        scene.add(this.cone1);
        scene.add(this.cone2);
        scene.add(this.cone3);
        scene.add(this.cone4);
        scene.add(this.cone5);
        scene.add(this.cone6)

    }
}