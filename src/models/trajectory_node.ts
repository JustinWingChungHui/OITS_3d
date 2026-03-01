import * as Three from 'three'

export default class TrajectoryNode {
    public vector: Three.Vector3;
    public t = 0;
    public speed: number | null = null

    constructor(t: number, x: number, y: number, z: number, speed: number | null = null) {
        this.t = t;
        this.vector = new Three.Vector3(x, y, z);
        this.speed = speed;
    }

    public toString(): string {
        return `t:${this.t}, x:${this.vector.x}, y:${this.vector.y}, z:${this.vector.z}, `
    }

    public GetDistanceFromOrigin(): number {
        const total = (this.vector.x ** 2) + (this.vector.y ** 2) + (this.vector.z ** 2)
        return Math.sqrt(total)
    } 
}