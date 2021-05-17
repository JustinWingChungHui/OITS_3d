import * as Three from 'three'
import TrajectoryNode from './trajectory_node';
import store from '@/store';
import AnimationState from './animation_state';

export default class Trajectory {
    public id: string;
    public nodes: TrajectoryNode[] = []
    public index = 0;
    public partialIndex = 0;
    public line: Three.Line;
    public currentNode: TrajectoryNode;
    public showingPastOnly = false;

    public isLastNode = false;

    constructor(id: string, csv: string[], pathColor = 'white') {
        this.id = id;
        const material = new Three.LineBasicMaterial( { color: pathColor, linewidth: 1.0 } );
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

        const geometry = new Three.BufferGeometry()
                            .setFromPoints(points);
        this.line = new Three.Line(geometry, material);

        if (this.nodes.length > 0) {
            this.currentNode = this.nodes[0];
        } else {
            this.currentNode = new TrajectoryNode(0, 0, 0, 0);
        }
    }

    public showPastOnly() {
        this.showingPastOnly = true;
        const geometry = this.line.geometry as THREE.BufferGeometry;
        geometry.setDrawRange(0, 0)
    }

    public getNextNode(): TrajectoryNode {

        switch(store.state.MissionAnimation.AnimationState) {
            case AnimationState.rewind: {
                this.index = 0;
                this.partialIndex = 0;
                this.isLastNode = false;
                break;
            }
            case AnimationState.paused: {
                break;
            }
            case AnimationState.playing: {
                const playbackSpeed = store.state.MissionAnimation.PlaybackSpeed;
                if (this.index  < this.nodes.length - playbackSpeed - 1) {
                    this.partialIndex += playbackSpeed;
                    this.index = Math.floor(this.partialIndex); 
                } else {
                    this.isLastNode = true;
                }

                break;
            }
        }

        const node = this.nodes[this.index];
        
        this.currentNode = node;

        return node;
    }

    public getNodeForCurrentTime(): TrajectoryNode {

        if (store.state.MissionAnimation.AnimationState === AnimationState.rewind) {
            this.index = 0;
            this.partialIndex = 0;
            const node = this.nodes[this.index];
            this.currentNode = node;
            return this.currentNode;
        }

        const frameskip = Math.floor(Math.max(1, store.state.MissionAnimation.PlaybackSpeed));

        if (this.nodes.length < this.index + frameskip + 1) {
            this.isLastNode = true;
            return this.currentNode;
        }

        const t = store.state.MissionAnimation.t;
        const deltaT = store.state.MissionAnimation.deltaT;

        // Check next node is correct time
        const nextNode = this.nodes[this.index + frameskip];
        if (nextNode.t <= t + deltaT * frameskip
            && nextNode.t >= t - deltaT * frameskip) {

            return this.getNextNode();
        }

        // Find closest node
        if (this.currentNode.t < t + deltaT * frameskip) {
            for (let i = this.index; i < this.nodes.length; i++) {
                
                if (this.nodes[i].t >= t) {
                    this.index = Math.max(0, i - frameskip);
                    this.partialIndex = this.index
                    this.currentNode = this.nodes[this.index];
                    return this.currentNode;
                }
            }

            window.console.error(`no node found for state t: ${store.state.t}`);
        }

        window.console.log(2);
        return this.currentNode;
    }

    public animate() {
        if (this.showingPastOnly) {
            const geometry = this.line.geometry as THREE.BufferGeometry;
            geometry.setDrawRange(0, this.index);
        }
    }

    public load(scene: Three.Scene) {
        scene.add(this.line);
    }
}