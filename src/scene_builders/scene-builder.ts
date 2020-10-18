import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import BodyBuilder from './body-builder';
import Body from '@/models/body';
import Probe from '@/models/probe';
import store from '@/store';
import config from '@/config';
import SphericalBody from '@/models/spherical_body';
import ResourceTracker from './resource-tracker';

// https://stemkoski.github.io/Three.js/

export default class SceneBuilder {
    private camera: Three.PerspectiveCamera;
    private scene: Three.Scene;
    private renderer: Three.WebGLRenderer;
    private controls: OrbitControls;
    private bodiesById: { [id: string]: Body } = {};

    private earth?: SphericalBody;
    private probe?: Probe;

    constructor(container: HTMLElement) {
        ResourceTracker.init();
        Three.Cache.enabled = true;
        this.scene = ResourceTracker.track(new Three.Scene());
        this.camera = ResourceTracker.track(new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.001, 400));
        const startPos = config.cameraStartPosition;
        this.camera.position.set(startPos.x,startPos.y, startPos.z);

        this.renderer = ResourceTracker.track(new Three.WebGLRenderer({antialias: true}));
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(container.clientWidth, container.clientHeight);

        container.appendChild(this.renderer.domElement);

        this.controls = ResourceTracker.track(new OrbitControls(this.camera, this.renderer.domElement));
        this.controls.zoomSpeed = 2.5;

        // Load Light
        const ambientLight = ResourceTracker.track(new Three.AmbientLight(0xffffff, 0.2));
        this.scene.add(ambientLight);

        const pointLight = ResourceTracker.track(new Three.PointLight(0xffffff, 2, 0, 1));
        this.scene.add(pointLight);
        pointLight.position.x = 0;
        pointLight.position.y = 0;
        pointLight.position.z = 0;
    }

    public async load(): Promise<void> {
        window.console.log(`SceneBuilder.load()`)
        await this.loadBackground();
        const bodyBuilder = new BodyBuilder()
        this.bodiesById = await bodyBuilder.AddToScene(this.scene);
        this.renderer.render(this.scene, this.camera);

        this.probe = this.bodiesById['PROBE'] as Probe;
        this.earth = this.bodiesById['EARTH'] as SphericalBody;
        if (!this.earth) {
            this.earth = this.bodiesById['EARTH BARYCENTER'] as SphericalBody;
        }
    }

    public animate = () => {

        // Animate the probe, use time relative to probe
        const probe = this.probe as Probe;
        const t = probe.animateAndGetTime();


        // set t directly on state to not kill Vuex
        store.state.t = t;
        
        // Point the camera at the probe
        if (store.state.userSettings.cameraTracksProbe) {
            const pVector = probe.trajectory?.currentNode?.vector;
            if (pVector) {
                this.controls.target.set(pVector.x, pVector.y, pVector.z);
                this.controls.update();
            }
        }

        // Move the other bodies
        for (const id in this.bodiesById) {
            if (id !== 'PROBE') {
                this.bodiesById[id].animate(); 
            }
        }

        if (this.earth) {
            probe.pointTowardsBody(this.earth);
        }

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.animate);
    }

    public dispose() {
        ResourceTracker.dispose();
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