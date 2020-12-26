import * as Three from 'three';
import Body from '../models/body';
import Store from '@/store';
import Marker from '@/models/marker';
import config from '@/config';

export default class BodyBuilder {

    private bodiesById: { [id: string]: Body } = {};

    constructor() {
        for (const body of config.bodies) {
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

        for (const id in Store.state.MissionAnimation.TrajectoryByBodyId) {

            if (id.includes('INTERMEDIATE')) {
                const marker = new Marker(id, 0, 0, 0, config.markerSize);
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