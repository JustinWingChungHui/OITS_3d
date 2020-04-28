import * as Three from 'three'
import IBody from './body';
import Trajectory from './trajectory';
import Store from '@/store';

export default class Marker implements IBody{
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
                && this.cone3 && this.cone4) {

            const node = this.trajectory.getNextNode();
            this.cone1.position.x = node.vector.x;
            this.cone1.position.y = node.vector.y - 2 * this.size;
            this.cone1.position.z = node.vector.z;
            this.cone2.position.x = node.vector.x;
            this.cone2.position.y = node.vector.y;
            this.cone2.position.z = node.vector.z - 2 * this.size;
            this.cone3.position.x = node.vector.x;
            this.cone3.position.y = node.vector.y + 2 * this.size;
            this.cone3.position.z = node.vector.z;
            this.cone4.position.x = node.vector.x;
            this.cone4.position.y = node.vector.y;
            this.cone4.position.z = node.vector.z + 2 * this.size;
        }
    }


    public async load(scene: Three.Scene): Promise<void> {
        window.console.log(`Marker.load()`)
        const coneGeometry = new Three.ConeBufferGeometry(this.size, this.size * 4, 16); 

        const coneMaterial = new Three.MeshBasicMaterial( {color: 'orange'} ); 
        this.cone1 = new Three.Mesh(coneGeometry, coneMaterial);
        this.cone2 = new Three.Mesh(coneGeometry, coneMaterial);
        this.cone3 = new Three.Mesh(coneGeometry, coneMaterial);
        this.cone4 = new Three.Mesh(coneGeometry, coneMaterial);

        this.cone1.position.set(this.x, this.y, this.z);
        this.cone2.position.set(this.x, this.y, this.z);
        this.cone3.position.set(this.x, this.y, this.z);
        this.cone4.position.set(this.x, this.y, this.z);

        this.cone1.rotation.set(0, 0, 0);
        this.cone2.rotation.set(Math.PI / 2, 0, 0);
        this.cone3.rotation.set(Math.PI, 0, 0);
        this.cone4.rotation.set(3 * Math.PI / 2, 0, 0);

        scene.add(this.cone1);
        scene.add(this.cone2);
        scene.add(this.cone3);
        scene.add(this.cone4);

        if (this.id in Store.state.CsvByBodyId) {
            this.trajectory = new Trajectory(Store.state.CsvByBodyId[this.id], "gray");
            this.trajectory.load(scene);
        }
    }
}