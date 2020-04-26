import * as Three from 'three'

export default class TrajectoryNode {
    public vector: Three.Vector3;
    public t = 0;

    constructor(t: number, x: number, y: number, z: number) {
        this.t = t;
        this.vector = new Three.Vector3(x, y, z);
    }

    public toString(): string {
        return `t:${this.t}, x:${this.vector.x}, y:${this.vector.y}, z:${this.vector.z}, `
    }
}