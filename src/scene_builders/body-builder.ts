import * as Three from 'three';
import SphericalBody from '../models/spherical_body';
import Body from '../models/body';
import Asteroid from '../models/asteroid';
import Probe from '@/models/probe';
import Store from '@/store';
import Marker from '@/models/marker';

export default class BodyBuilder {

    // Textures https://www.solarsystemscope.com/textures/
    // Codes http://www-pi.physics.uiowa.edu/docs/spice/NAIF_IDS.HTML
    private bodies: Array<Body> = [
        new Probe('PROBE', 0, 0, 10, 0.005),
        new SphericalBody('SUN', 0, 0, 0, 0.2, '/assets/backgrounds/sun.jpg'),
        new SphericalBody('MERCURY BARYCENTER', 40, 0, 0, 0.04, '/assets/backgrounds/mercury.jpg'),
        new SphericalBody('VENUS BARYCENTER', 80, 0, 0, 0.04, '/assets/backgrounds/venus.jpg'),
        new SphericalBody('EARTH BARYCENTER', 0, 0, 0, 0.06, '/assets/backgrounds/earth.jpg'),
        new SphericalBody('MARS BARYCENTER', 160, 0, 0, 0.06, '/assets/backgrounds/mars.jpg'),
        new SphericalBody('JUPITER BARYCENTER', 200, 0, 0, 0.22, '/assets/backgrounds/jupiter.jpg'),
        new SphericalBody('SATURN BARYCENTER', 240, 0, 0, 0.2, '/assets/backgrounds/saturn.jpg'),
        new SphericalBody('URANUS BARYCENTER', 280, 0, 0, 0.16, '/assets/backgrounds/uranus.jpg'),
        new SphericalBody('NEPTUNE BARYCENTER', 320, 0, 0, 0.16, '/assets/backgrounds/neptune.jpg'),
        new SphericalBody('PLUTO BARYCENTER', 400, 0, 0, 0.08, '/assets/backgrounds/moon.jpg'),
        new SphericalBody('MERCURY', 0, 0, 0, 0.04, '/assets/backgrounds/mercury.jpg'),
        new SphericalBody('VENUS', 0, 0, 0, 0.04, '/assets/backgrounds/venus.jpg'),
        new SphericalBody('MOON', 0, 0, 0, 0.01, '/assets/backgrounds/moon.jpg'),
        new SphericalBody('EARTH', 0, 0, 0, 0.06, '/assets/backgrounds/earth.jpg'),
        new Asteroid('CHURYUMOV-GERASIMENKO', 0, 0, 40, 0.005),
        new Asteroid('LUTETIA', 0, 0, 40, 0.005),
        new Asteroid('STEINS', 0, 0, 40, 0.005),
        new Asteroid('OUMUAMUA', 0, 0, 40, 0.005),
        new Asteroid('HALLEY', 0, 0, 40, 0.005),
        new Asteroid('BENNU', 0, 0, 40, 0.005),
        new Asteroid('VESTA', 0, 0, 40, 0.005),
        new Asteroid('3825054', 0, 0, 40, 0.005),
        new Asteroid('2099942', 0, 0, 40, 0.005),
        new Asteroid('3830896', 0, 0, 40, 0.005),
        new Asteroid('2099942', 0, 0, 40, 0.005),
    ];

    private bodiesById: { [id: string]: Body } = {};

    constructor() {
        for (const body of this.bodies) {
            this.bodiesById[body.id] = body;
        }
    }

    public async AddToScene(scene: Three.Scene): Promise<{ [id: string]: Body }> {

        window.console.log(`BodyBuilder.AddToScene()`)
        const bodies: { [id: string]: Body } = {};
        const promises = [];

        // Add in the sun
        const sun = this.bodiesById['SUN'];
        promises.push(sun.load(scene));
        bodies[sun.id] = sun;

        for (const id in Store.state.TrajectoryByBodyId) {

            if (id.includes('INTERMEDIATE')) {
                const marker = new Marker(id, 0, 0, 0, 0.01);
                promises.push(marker.load(scene));
                bodies[marker.id] = marker;

            } else if (!this.bodiesById[id]) {
                window.console.error(`id ${id} not recognised!`)

            } else {

                const body = this.bodiesById[id];
                promises.push(body.load(scene));

                bodies[body.id] = body;
            }
        }

        await Promise.all(promises);

        return bodies;
    }
}