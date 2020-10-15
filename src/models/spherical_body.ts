import * as Three from 'three'
import IBody from './body';
import Trajectory from './trajectory';
import store from '@/store';


export default class SphericalBody implements IBody{
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
            if (store.getters.isAnimating) {
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
        window.console.log(`SphericalBody.load()`)
        await this.loadTexture();

        if (this.id in store.state.TrajectoryByBodyId) {
            this.trajectory = store.state.TrajectoryByBodyId[this.id];
            this.trajectory.line.material = new Three.LineBasicMaterial({ 
                color: store.state.userSettings.planetTrajectoryColor
            });
            this.trajectory.load(scene);

            this.x = this.trajectory.currentNode.vector.x;
            this.y = this.trajectory.currentNode.vector.y;
            this.z = this.trajectory.currentNode.vector.z;
        }

        const size = this.radius * store.state.userSettings.bodySizeMultiple;

        const sphereGeometry = new Three.SphereGeometry(
                        size, SphericalBody.WIDTH_SEGMENTS, SphericalBody.HEIGHT_SEGMENTS); 

        const sphereMaterial = new Three.MeshBasicMaterial( {map: this.texture} ); 
        this.sphere = new Three.Mesh(sphereGeometry, sphereMaterial);
        this.sphere.position.set(this.x, this.y, this.z);
        this.sphere.rotation.x += Math.PI / 2;

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