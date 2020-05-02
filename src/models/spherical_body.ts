import * as Three from 'three'
import IBody from './body';
import Trajectory from './trajectory';
import Store from '@/store';
import AnimationState from './animation_state';

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

    public animate() {
        if (this.sphere) {
            if (Store.state.animationState == AnimationState.playing) {
                this.sphere.rotation.z += 0.002;
            }

            if (this.trajectory) {
                const node = this.trajectory.getNodeForCurrentTime();
                this.sphere.position.x = node.vector.x;
                this.sphere.position.y = node.vector.y;
                this.sphere.position.z = node.vector.z;
            }
        }
    }


    public async load(scene: Three.Scene): Promise<void> {
        window.console.log(`SphericalBody.load()`)
        await this.loadTexture();

        if (this.id in Store.state.TrajectoryByBodyId) {
            this.trajectory = Store.state.TrajectoryByBodyId[this.id];
            this.trajectory.line.material = new Three.LineBasicMaterial( { color: 'darkblue' } );
            this.trajectory.load(scene);

            this.x = this.trajectory.currentNode.vector.x;
            this.y = this.trajectory.currentNode.vector.y;
            this.z = this.trajectory.currentNode.vector.z;
        }

        const sphereGeometry = new Three.SphereGeometry(this.radius, 24, 16 ); 

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