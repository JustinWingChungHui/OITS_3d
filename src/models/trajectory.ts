import TrajectoryNode from './trajectory_node';

export default class Trajectory {
    public nodes: TrajectoryNode[] = []
    public index = 0;

    constructor(csv: string[]) {

        for (const line of csv) {
            const val = line.split(',');
            const t = Number(val[0]);
            const x = Number(val[1]);
            const y = Number(val[2]);
            const z = Number(val[3]);
            const node = new TrajectoryNode(t, x, y, z);

            this.nodes.push(node);
        }
    }

    public getNextNode(): TrajectoryNode {
        const node = this.nodes[this.index];

        this.index++;
        if (this.index >= this.nodes.length) {
            this.index = 0;
        }

        return node;
    }
}