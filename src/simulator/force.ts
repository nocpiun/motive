import { gravity as g } from "@/common/global";

import { Vector, type IVector } from "./vector";

interface IForce extends IVector {
    getAccelerate(mass: number): Vector
    setSize(size: number): void
    setToZero(): void
}

export class Force extends Vector implements IForce {
    public constructor(x: number, y: number) {
        super(x, y);
    }

    public getAccelerate(mass: number) {
        return Vector.multiplyScalar(this, 1 / mass);
    }

    public setSize(size: number) {
        const length = this.length; // To avoid duplicated calculation of vector length
        const sin = this.y / length;
        const cos = this.x / length;

        this.x = size * cos;
        this.y = size * sin;
    }

    public setToZero() {
        this.x = this.y = 0;
    }

    public static gravity(mass: number): Force {
        return new Force(0, -mass * g);
    }

    public static from(vector: Vector): Force {
        return new Force(vector.x, vector.y);
    }

    public static override add(vector1: Vector, vector2: Vector): Force {
        return new Force(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    public static override sub(vector1: Vector, vector2: Vector): Force {
        return new Force(vector1.x - vector2.x, vector1.y - vector2.y);
    }

    public static override multiplyScalar(vector: Vector, scalar: number): Force {
        return new Force(vector.x * scalar, vector.y * scalar);
    }

    public static override reverse(vector: Vector): Force {
        return new Force(-vector.x, -vector.y);
    }
}
