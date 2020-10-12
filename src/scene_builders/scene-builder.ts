import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import BodyBuilder from './body-builder';
import Body from '@/models/body';
import Probe from '@/models/probe';
import store from '@/store';
import config from '@/config';

// https://stemkoski.github.io/Three.js/

export default class SceneBuilder {
    private container: HTMLElement;
    private camera: Three.PerspectiveCamera;
    private scene: Three.Scene;
    private renderer: Three.WebGLRenderer;
    private controls: OrbitControls;
    private bodiesById: { [id: string]: Body } = {};

    constructor(container: HTMLElement) {
        Three.Cache.enabled = true;
        this.container = container;
        this.scene = new Three.Scene();
        this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.001, 400);
        const startPos = config.cameraStartPosition;
        this.camera.position.set(startPos.x,startPos.y, startPos.z);

        this.renderer = new Three.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(container.clientWidth, container.clientHeight);

        container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.zoomSpeed = 2.5;

        // Load Light
        const ambientLight = new Three.AmbientLight(0xffffff, store.state.userSettings.light);
        this.scene.add(ambientLight);
    }

    public async load(): Promise<void> {
        window.console.log(`SceneBuilder.load()`)
        await this.loadBackground();
        const bodyBuilder = new BodyBuilder()
        this.bodiesById = await bodyBuilder.AddToScene(this.scene);
        this.renderer.render(this.scene, this.camera);
    }

    public animate = () => {

        // Animate the probe, use time relative to probe
        const probe = this.bodiesById['PROBE'] as Probe;
        const t = probe.animateAndGetTime();


        // set t directly on state to not kill Vuex
        store.state.t = t;
        
        // Point the camera at the probe
        const pVector = probe.trajectory?.currentNode?.vector;
        if (pVector) {
            this.controls.target.set(pVector.x, pVector.y, pVector.z);
            this.controls.update();
        }

        // Move the other bodies
        for (const id in this.bodiesById) {
            if (id !== 'PROBE') {
                this.bodiesById[id].animate(); 
            }
        }

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.animate);
    }

    private async loadBackground(): Promise<void> {
        window.console.log(`SceneBuilder.loadBackground()`)

        const promise = await new Promise<void>((resolve) => {
            new Three.TextureLoader().load(store.getters.backgroundPath, (texture) => {
                this.scene.background = texture;
                resolve();
            });
        });

        return promise;
    }
}