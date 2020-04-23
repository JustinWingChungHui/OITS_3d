import * as Three from 'three';
import SphericalBody from '../models/spherical_body';
import Body from '../models/body';
import Asteroid from '../models/asteroid';
import Probe from '@/models/probe';

export default class BodyBuilder {

    // Textures https://www.solarsystemscope.com/textures/
    // Codes http://www-pi.physics.uiowa.edu/docs/spice/NAIF_IDS.HTML
    private bodies: Array<Body> = [
        new Probe('MAIN', 'Probe', 0, 0, 0, 1),
        new SphericalBody('0', 'Sun', 0, 0, 0, 20, '/assets/backgrounds/sun.jpg'),
        new SphericalBody('1', 'Mercury Barycenter', 40, 0, 0, 1, '/assets/backgrounds/mercury.jpg'),
        new SphericalBody('2', 'Venus Barycenter', 80, 0, 0, 2, '/assets/backgrounds/venus.jpg'),
        new SphericalBody('3', 'Earth Barycenter', 0, 0, 0, 0.1, '/assets/backgrounds/earth.jpg'),
        new SphericalBody('4', 'Mars Barycenter', 160, 0, 0, 3, '/assets/backgrounds/mars.jpg'),
        new SphericalBody('5', 'Jupiter Barycenter', 200, 0, 0, 6, '/assets/backgrounds/jupiter.jpg'),
        new SphericalBody('6', 'Saturn Barycenter', 240, 0, 0, 4, '/assets/backgrounds/saturn.jpg'),
        new SphericalBody('7', 'Uranus Barycenter', 280, 0, 0, 4, '/assets/backgrounds/uranus.jpg'),
        new SphericalBody('8', 'Neptune Barycenter', 320, 0, 0, 4, '/assets/backgrounds/neptune.jpg'),
        new SphericalBody('9', 'Pluto Barycenter', 400, 0, 0, 4, '/assets/backgrounds/moon.jpg'),
        new SphericalBody('199', 'Mercury', 0, 0, 0, 1, '/assets/backgrounds/mercury.jpg'),
        new SphericalBody('299', 'Venus', 0, 0, 0, 2, '/assets/backgrounds/venus.jpg'),
        new SphericalBody('301', 'Moon', 0, 0, 0, 0.2, '/assets/backgrounds/moon.jpg'),
        new SphericalBody('399', 'Earth', 0, 0, 0, 20, '/assets/backgrounds/earth.jpg'),
        new Asteroid('1000012', 'Churyumov-Gerasimenko', 0, 0, 40, 0.02),
        new Asteroid('2000021', 'Lutetia', 0, 0, 40, 0.02,),
        new Asteroid('2002867', 'Steins', 0, 0, 40, 0.02),
        new Asteroid('3788040', 'Oumuamua', 0, 0, 40, 0.02),
        new Asteroid('1000036', 'Halley', 0, 0, 40, 0.02),
        new Asteroid('2101955', 'Bennu', 0, 0, 40, 0.02),
        new Asteroid('2000004', 'Vesta', 0, 0, 40, 0.02),
        new Asteroid('3825054', '3825054', 0, 0, 40, 0.02),
        new Asteroid('2099942', '2099942', 0, 0, 40, 0.02),
        new Asteroid('3830896', '3830896', 0, 0, 40, 0.02),
        new Asteroid('2099942', '2099942', 0, 0, 40, 0.02),
    ];

    private bodiesById: { [id: string]: Body } = {};

    constructor() {
        for (const body of this.bodies) {
            this.bodiesById[body.id] = body;
        }
    }

    public async AddToScene(ids: Array<string>, scene: Three.Scene): Promise<Body[]> {

        const bodies = new Array<Body>();
        const promises = [];

        for (const id of ids) {
            const body = this.bodiesById[id];
            promises.push(body.load(scene));
            bodies.push(body);
        }

        await Promise.all(promises);

        return bodies;
    }
}