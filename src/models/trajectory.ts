import * as Three from 'three'
import TrajectoryNode from './trajectory_node';

export default class Trajectory {
    public nodes: TrajectoryNode[] = []
    public index = 0;
    public line: Three.Line;

    constructor(csv: string[], pathColor = 'white') {
        const material = new Three.LineBasicMaterial( { color: pathColor } );
        const points = new Array<Three.Vector3>();

        for (const line of csv) {
            const val = line.split(',');
            const t = Number(val[0]);
            const x = Number(val[1]);
            const y = Number(val[2]);
            const z = Number(val[3]);
            const node = new TrajectoryNode(t, x, y, z);

            points.push(node.vector);
            this.nodes.push(node);
        }

        const geometry = new Three.BufferGeometry().setFromPoints(points);
        this.line = new Three.Line( geometry, material );
    }

    public getNextNode(): TrajectoryNode {
        const node = this.nodes[this.index];

        this.index++;
        if (this.index >= this.nodes.length) {
            this.index = 0;
        }

        return node;
    }

    public load(scene: Three.Scene) {
        scene.add(this.line);
    }
}