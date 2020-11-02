import Body from '@/models/body';
import Probe from '@/models/probe';
import SphericalBody from '@/models/spherical_body';
import Asteroid from '@/models/asteroid';

interface Config {
    BaseUrl: string;
    pathsUrl: string;
    missionsUrl: string;
    ZeroDate: number;
    bodies: Array<Body>;
    backgrounds: { [id: string]: string };
    markerSize: number;

    cameraStartPosition: { [id: string]: number };
}

const config: Config = {
    BaseUrl: 'https://oits.justinhui.com',

    // csv results
    pathsUrl: '/results/{uid}/paths/',
    missionsUrl: '/missions/',

    ZeroDate: 946724329, // 2000-01-01 00:00:00 corrected for Barycentric time

    // Textures https://www.solarsystemscope.com/textures/
    // Codes http://www-pi.physics.uiowa.edu/docs/spice/NAIF_IDS.HTML
    bodies: new Array<Body>(
        new Probe('PROBE', 0, 0, 10, 'white', 0.0005),
        new SphericalBody('SUN', 0, 0, 0, 0.02, '/assets/backgrounds/sun.jpg', 0.002),
        new SphericalBody('MERCURY BARYCENTER', 40, 0, 0, 0.004, '/assets/backgrounds/mercury.jpg', 0.02),
        new SphericalBody('VENUS BARYCENTER', 80, 0, 0, 0.004, '/assets/backgrounds/venus.jpg', 0.02),
        new SphericalBody('EARTH BARYCENTER', 0, 0, 0, 0.006, '/assets/backgrounds/earth.jpg', 0.02),
        new SphericalBody('MARS BARYCENTER', 160, 0, 0, 0.006, '/assets/backgrounds/mars.jpg', 0.02),
        new SphericalBody('JUPITER BARYCENTER', 200, 0, 0, 0.022, '/assets/backgrounds/jupiter.jpg', 0.02),
        new SphericalBody('SATURN BARYCENTER', 240, 0, 0, 0.02, '/assets/backgrounds/saturn.jpg', 0.02),
        new SphericalBody('URANUS BARYCENTER', 280, 0, 0, 0.016, '/assets/backgrounds/uranus.jpg', 0.02),
        new SphericalBody('NEPTUNE BARYCENTER', 320, 0, 0, 0.016, '/assets/backgrounds/neptune.jpg', 0.02),
        new SphericalBody('PLUTO BARYCENTER', 400, 0, 0, 0.008, '/assets/backgrounds/moon.jpg', 0.02),
        new SphericalBody('MERCURY', 0, 0, 0, 0.004, '/assets/backgrounds/mercury.jpg', 0.02),
        new SphericalBody('VENUS', 0, 0, 0, 0.004, '/assets/backgrounds/venus.jpg', 0.02),
        new SphericalBody('MOON', 0, 0, 0, 0.001, '/assets/backgrounds/moon.jpg', 0.02),
        new SphericalBody('EARTH', 0, 0, 0, 0.006, '/assets/backgrounds/earth.jpg', 0.02),
        new Asteroid('CHURYUMOV-GERASIMENKO', 0, 0, 40, 0.0005),
        new Asteroid('LUTETIA', 0, 0, 40, 0.0005),
        new Asteroid('STEINS', 0, 0, 40, 0.0005),
        new Asteroid('OUMUAMUA', 0, 0, 40, 0.0005),
        new Asteroid('HALLEY', 0, 0, 40, 0.0005),
        new Asteroid('BENNU', 0, 0, 40, 0.0005),
        new Asteroid('VESTA', 0, 0, 40, 0.0005),
        new Asteroid('3825054', 0, 0, 40, 0.0005),
        new Asteroid('2099942', 0, 0, 40, 0.0005),
        new Asteroid('3830896', 0, 0, 40, 0.0005),
        new Asteroid('2099942', 0, 0, 40, 0.0005),
    ),

    backgrounds: {
        'Milky Way' : '/assets/backgrounds/stars_milky_way.jpg',
        'Universe': '/assets/backgrounds/universe.jpg',
        'Psychedelic': '/assets/backgrounds/psychedelic.jpg',
        'Space': '/assets/backgrounds/space.jpg',
        'White': '/assets/backgrounds/white.jpg',
        'Grey': '/assets/backgrounds/grey.jpg',
        'Black': '/assets/backgrounds/black.jpg',
    },

    // Used to mark intermediate points
    markerSize: 0.001,

    cameraStartPosition: {
        x: 0,
        y: 0,
        z: 3,
    },
}

export default config;