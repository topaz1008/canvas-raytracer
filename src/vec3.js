export class Vec3 {
    constructor() {
        const args = Array.prototype.slice.call(arguments);

        if (args.length === 1) {
            this.x = args[0].x;
            this.y = args[0].y;
            this.z = args[0].z;

        } else {
            this.x = args[0] || 0;
            this.y = args[1] || 0;
            this.z = args[2] || 0;
        }
    }

    add(v) {
        return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    sub(v) {
        return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    mult(c) {
        return new Vec3(this.x * c, this.y * c, this.z * c);
    }

    clone() {
        return new Vec3(this.x, this.y, this.z);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    normalize() {
        const magnitude = 1.0 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

        return new Vec3(this.x * magnitude, this.y * magnitude, this.z * magnitude);
    }

    norm() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}
