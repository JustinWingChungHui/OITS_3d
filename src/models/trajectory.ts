import * as Three from 'three'
import TrajectoryNode from './trajectory_node';
import store from '@/store';
import AnimationState from './animation_state';

export default class Trajectory {
    public id: string;
    public nodes: TrajectoryNode[] = []
    public index = 0;
    public line: Three.Line;
    public currentNode: TrajectoryNode;

    public get isLastNode(): boolean {
        if (this.index >= this.nodes.length - 1) {
            return true;
        }

        return false;
    }

    constructor(id: string, csv: string[], pathColor = 'white') {
        this.id = id;
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
        this.line = new Three.Line(geometry, material);

        if (this.nodes.length > 0) {
            this.currentNode = this.nodes[0];
        } else {
            this.currentNode = new TrajectoryNode(0, 0, 0, 0);
        }
    }

    public getNextNode(): TrajectoryNode {

        switch(store.state.animationState) {
            case AnimationState.rewind: {
                this.index = 0;
                break;
            }
            case AnimationState.paused: {
                break;
            }
            case AnimationState.playing: {
                if (this.index  < this.nodes.length - 1) {
                    this.index++; 
                }
                break;
            }
        }

        const node = this.nodes[this.index];
        this.currentNode = node;

        return node;
    }

    public getNodeForCurrentTime(): TrajectoryNode {

        if (store.state.animationState === AnimationState.rewind) {
            this.index = 0;
            const node = this.nodes[this.index];
            this.currentNode = node;
            return this.currentNode;
        }

        if (this.nodes.length < this.index + 2) {
            return this.currentNode;
        }

        // Check next node is correct time
        const nextNode = this.nodes[this.index + 1];
        if (nextNode.t <= store.state.t + store.state.deltaT
            && nextNode.t >= store.state.t - store.state.deltaT) {

            return this.getNextNode();
        }

        // Find closest node
        if (this.currentNode.t < store.state.t) {
            for (let i = this.index; i < this.nodes.length; i++) {
                if (this.nodes[i].t > store.state.t) {
                    this.index = i;
                    this.currentNode = this.nodes[i];
                    return this.currentNode;
                }
            }

            window.console.error(`no node found for state t: ${store.state.t}`);
        }

        return this.currentNode;
    }

    public load(scene: Three.Scene) {
        scene.add(this.line);
    }
}