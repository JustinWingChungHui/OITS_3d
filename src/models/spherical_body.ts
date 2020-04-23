import * as Three from 'three'
import IBody from './body';
import Trajectory from './trajectory';

export default class SphericalBody implements IBody{
    public id: string;
    public description: string;
    public x: number;
    public y: number;
    public z: number;
    public texture: Three.Texture | null = null;
    public radius: number;
    public trajectory: Trajectory | null = null;

    private textureFile: string;
    private sphere: Three.Mesh | null = null;

    constructor(id: string,
                description: string,
                x: number,
                y: number,
                z: number,
                radius: number,
                texture: string) {
        this.id = id;
        this.description = description;
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.textureFile = texture;
    }

    public animate() {
        if (this.sphere) {
            this.sphere.rotation.y += 0.002;

            if (this.trajectory) {
                const node = this.trajectory.getNextNode();
                this.sphere.position.x = node.x;
                this.sphere.position.y = node.y;
                this.sphere.position.z = node.z;
            }
        }
    }


    public async load(scene: Three.Scene): Promise<void> {

        await this.loadTexture();

        const sphereGeometry = new Three.SphereGeometry(this.radius, 32, 16 ); 

        const sphereMaterial = new Three.MeshBasicMaterial( {map: this.texture} ); 
        this.sphere = new Three.Mesh(sphereGeometry, sphereMaterial);
        this.sphere.position.set(this.x, this.y, this.z);

        scene.add(this.sphere);
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