

export default class TrajectoryNode {

    public t = 0;
    public x = 0;
    public y = 0;
    public z = 0;

    constructor(t: number, x: number, y: number, z: number) {
        this.t = t;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public toString(): string {
        return `t:${this.t}, x:${this.x}, y:${this.y}, z:${this.z}, `
    }
}