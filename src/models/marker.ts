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
    private cone5: Three.Mesh | null = null;
    private cone6: Three.Mesh | null = null;

    private narrowness = 3;

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
                && this.cone5 && this.cone6) {

            const node = this.trajectory.getNextNode();
            this.cone1.position.x = node.vector.x;
            this.cone1.position.y = node.vector.y - this.narrowness * this.size;
            this.cone1.position.z = node.vector.z;
            this.cone2.position.x = node.vector.x;
            this.cone2.position.y = node.vector.y;
            this.cone2.position.z = node.vector.z - this.narrowness * this.size;
            this.cone3.position.x = node.vector.x;
            this.cone3.position.y = node.vector.y + this.narrowness * this.size;
            this.cone3.position.z = node.vector.z;
            this.cone4.position.x = node.vector.x;
            this.cone4.position.y = node.vector.y;
            this.cone4.position.z = node.vector.z + this.narrowness * this.size;
            this.cone5.position.x = node.vector.x + this.narrowness * this.size;
            this.cone5.position.y = node.vector.y;
            this.cone5.position.z = node.vector.z;
            this.cone6.position.x = node.vector.x - this.narrowness * this.size;
            this.cone6.position.y = node.vector.y;
            this.cone6.position.z = node.vector.z;
        }
    }


    public async load(scene: Three.Scene): Promise<void> {
        window.console.log(`Marker.load()`)

        if (this.id in Store.state.TrajectoryByBodyId) {
            this.trajectory = Store.state.TrajectoryByBodyId[this.id];
            this.trajectory.line.material = new Three.LineBasicMaterial( { color: 'gray' } );
            this.trajectory.load(scene);

            this.x = this.trajectory.currentNode.vector.x;
            this.y = this.trajectory.currentNode.vector.y;
            this.z = this.trajectory.currentNode.vector.z;
        }

        const coneGeometry = new Three.ConeBufferGeometry(this.size, this.size * this.narrowness * 2, 8); 

        const coneMaterial = new Three.MeshBasicMaterial( {color: 'green'} ); 
        this.cone1 = new Three.Mesh(coneGeometry, coneMaterial);
        this.cone2 = new Three.Mesh(coneGeometry, coneMaterial);
        this.cone3 = new Three.Mesh(coneGeometry, coneMaterial);
        this.cone4 = new Three.Mesh(coneGeometry, coneMaterial);
        this.cone5 = new Three.Mesh(coneGeometry, coneMaterial);
        this.cone6 = new Three.Mesh(coneGeometry, coneMaterial);

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