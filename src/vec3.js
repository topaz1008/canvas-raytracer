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

    add(rhs) {
        return new Vec3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
    }

    sub(rhs) {
        return new Vec3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
    }

    mult(rhs) {
        return new Vec3(this.x * rhs, this.y * rhs, this.z * rhs);
    }

    clone() {
        return new Vec3(this.x, this.y, this.z);
    }

    dot(rhs) {
        return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z;
    }

    normalize() {
        const invMagnitude = 1.0 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

        return new Vec3(this.x * invMagnitude, this.y * invMagnitude, this.z * invMagnitude);
    }

    norm() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}
