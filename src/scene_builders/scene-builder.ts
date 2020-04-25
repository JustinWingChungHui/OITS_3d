import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import BodyBuilder from './body-builder';
import IBody from '@/models/body';

// https://stemkoski.github.io/Three.js/

export default class SceneBuilder {
    private container: HTMLElement;
    private camera: Three.PerspectiveCamera;
    private scene: Three.Scene;
    private renderer: Three.WebGLRenderer;
    private controls: OrbitControls;
    private bodies: IBody[] = [];

    constructor(container: HTMLElement) {
        Three.Cache.enabled = true;
        this.container = container;
        this.scene = new Three.Scene();
        this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 1, 20000);
        this.camera.position.set(-0.64910268,-0.7735855, -3);

        this.renderer = new Three.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(container.clientWidth, container.clientHeight);

        container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Load Light
        const ambientLight = new Three.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
                
        // const directionalLight = new Three.DirectionalLight(0xffffff, 5);
        // directionalLight.position.set(0,0,0).normalize();
        // this.scene.add(directionalLight);	
    }

    public async load(): Promise<void> {

        await this.loadBackground();

        this.bodies = await new BodyBuilder().AddToScene(this.scene);
        this.renderer.gammaFactor = 5.2;
        this.renderer.render(this.scene, this.camera);
    }

    public animate = () => {
        requestAnimationFrame(this.animate);

        for (const body of this.bodies) {
            body.animate()
        }

        this.renderer.render(this.scene, this.camera);
    }

    private async loadBackground(): Promise<void> {
        const promise = await new Promise<void>((resolve) => {
            new Three.TextureLoader().load('/models/backgrounds/space.jpg', (texture) => {
                this.scene.background = texture;
                resolve;
            });
        });

        return promise;
    }
}