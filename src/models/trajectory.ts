import * as Three from 'three'
import TrajectoryNode from './trajectory_node';

export default class Trajectory {
    public nodes: TrajectoryNode[] = []
    public index = 0;
    public line: Three.Line;
    public currentNode: TrajectoryNode;

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

        if (this.nodes.length > 0) {
            this.currentNode = this.nodes[0];
        } else {
            this.currentNode = new TrajectoryNode(0, 0, 0, 0);
        }
    }

    public getNextNode(t: number = Number.MAX_VALUE): TrajectoryNode {


        let nextIndex = this.index + 1;
        if (nextIndex >= this.nodes.length - 1) {
            nextIndex = 0;
        }

        let node = this.nodes[this.index];
        const nextNode = this.nodes[nextIndex];

        // only get next point if t is within time window
        if (t === Number.MAX_VALUE || Math.abs(nextNode.t - t) < 1000000) {
            node = nextNode;
            this.currentNode = node;
            this.index = nextIndex;
        }

        return node;
    }

    public load(scene: Three.Scene) {
        scene.add(this.line);
    }
}