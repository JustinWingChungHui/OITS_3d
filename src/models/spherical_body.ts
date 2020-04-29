import * as Three from 'three'
import IBody from './body';
import Trajectory from './trajectory';
import Store from '@/store';

export default class SphericalBody implements IBody{
    public id: string;
    public x: number;
    public y: number;
    public z: number;
    public texture: Three.Texture | null = null;
    public radius: number;
    public trajectory: Trajectory | null = null;

    private textureFile: string;
    private sphere: Three.Mesh | null = null;

    constructor(id: string,
                x: number,
                y: number,
                z: number,
                radius: number,
                texture: string) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.textureFile = texture;
    }

    public animate(t: number) {
        if (this.sphere) {
            this.sphere.rotation.z += 0.002;

            if (this.trajectory) {
                const node = this.trajectory.getNextNode(t);
                this.sphere.position.x = node.vector.x;
                this.sphere.position.y = node.vector.y;
                this.sphere.position.z = node.vector.z;
            }
        }
    }


    public async load(scene: Three.Scene): Promise<void> {
        window.console.log(`SphericalBody.load()`)
        await this.loadTexture();

        const sphereGeometry = new Three.SphereGeometry(this.radius, 32, 16 ); 

        const sphereMaterial = new Three.MeshBasicMaterial( {map: this.texture} ); 
        this.sphere = new Three.Mesh(sphereGeometry, sphereMaterial);
        this.sphere.position.set(this.x, this.y, this.z);

        scene.add(this.sphere);

        if (this.id in Store.state.CsvByBodyId) {
            this.trajectory = new Trajectory(Store.state.CsvByBodyId[this.id], "gray");
            this.trajectory.load(scene);
        }
    }

    private async loadTexture(): Promise<void> {
        const promise = await new Promise<void>((resolve) => {

            new Three.TextureLoader().load(this.textureFile, (texture) => {
                this.texture = texture;
                resolve();
            });
        })
        .catch(err => {throw err});
    
        return promise;
    }
}