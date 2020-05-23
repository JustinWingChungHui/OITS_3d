import Body from '@/models/body';
import Probe from '@/models/probe';
import SphericalBody from '@/models/spherical_body';
import Asteroid from '@/models/asteroid';

const config = {
    BaseUrl: 'https://oits.justinhui.com',

    // csv results
    pathsUrl: '/results/{uid}/paths/',

    ZeroDate: 946724329, // 2000-01-01 00:00:00 corrected for Barycentric time

    // Textures https://www.solarsystemscope.com/textures/
    // Codes http://www-pi.physics.uiowa.edu/docs/spice/NAIF_IDS.HTML
    bodies: new Array<Body>(
        new Probe('PROBE', 0, 0, 10, 'white', 0.005),
        new SphericalBody('SUN', 0, 0, 0, 0.2, '/assets/backgrounds/sun.jpg', 0.002),
        new SphericalBody('MERCURY BARYCENTER', 40, 0, 0, 0.04, '/assets/backgrounds/mercury.jpg', 0.02),
        new SphericalBody('VENUS BARYCENTER', 80, 0, 0, 0.04, '/assets/backgrounds/venus.jpg', 0.02),
        new SphericalBody('EARTH BARYCENTER', 0, 0, 0, 0.06, '/assets/backgrounds/earth.jpg', 0.02),
        new SphericalBody('MARS BARYCENTER', 160, 0, 0, 0.06, '/assets/backgrounds/mars.jpg', 0.02),
        new SphericalBody('JUPITER BARYCENTER', 200, 0, 0, 0.22, '/assets/backgrounds/jupiter.jpg', 0.02),
        new SphericalBody('SATURN BARYCENTER', 240, 0, 0, 0.2, '/assets/backgrounds/saturn.jpg', 0.02),
        new SphericalBody('URANUS BARYCENTER', 280, 0, 0, 0.16, '/assets/backgrounds/uranus.jpg', 0.02),
        new SphericalBody('NEPTUNE BARYCENTER', 320, 0, 0, 0.16, '/assets/backgrounds/neptune.jpg', 0.02),
        new SphericalBody('PLUTO BARYCENTER', 400, 0, 0, 0.08, '/assets/backgrounds/moon.jpg', 0.02),
        new SphericalBody('MERCURY', 0, 0, 0, 0.04, '/assets/backgrounds/mercury.jpg', 0.02),
        new SphericalBody('VENUS', 0, 0, 0, 0.04, '/assets/backgrounds/venus.jpg', 0.02),
        new SphericalBody('MOON', 0, 0, 0, 0.01, '/assets/backgrounds/moon.jpg', 0.02),
        new SphericalBody('EARTH', 0, 0, 0, 0.06, '/assets/backgrounds/earth.jpg', 0.02),
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
    ),

    background: '/assets/backgrounds/stars_milky_way.jpg',

    // Brightness
    gammaFactor: 3.2,

    // Used to mark intermediate points
    markerSize: 0.01,

    cameraStartPosition: {
        x: 0,
        y: 0,
        z: 3,
    },

    planetTrajectoryColor: 'blue',
    probeTrajectoryColor: 'white',
    asteroidTrajectoryColor: 'red',

    fastforwardSpeed: 8,
}

export default config;