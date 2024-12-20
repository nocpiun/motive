import type { Point } from "./render/render";

import { LinkedNodes } from "@/common/utils/linkedNodes";

export interface IVector {
    x: number
    y: number

    multiply(vector: Vector): number
    getUnitVector(): Vector
    /**
     * Get the component vector by a **unit** normal vector
     * 
     * If the length of the given normal vector is not 1,
     * the result of this method will be completely wrong.
     * 
     * @param n A unit normal vector
     */
    getComponent(n: Vector): Vector
    isZero(): boolean
    get length(): number
}

export class Vector implements IVector {
    public static readonly Zero = new Vector(0, 0);

    public constructor(public x: number, public y: number) { }

    public multiply(vector: Vector) {
        return Vector.multiply(this, vector);
    }

    public getUnitVector(): Vector {
        const length = this.length;

        if(length === 0) {
            return Vector.Zero;
        }

        return new Vector(this.x / length, this.y / length);
    }

    public getComponent(n: Vector): Vector {
        // v' = (n·v) * n (when |n| = 1)
        return Vector.multiplyScalar(n, n.multiply(this));
    }

    public isZero(): boolean {
        return this.x === 0 && this.y === 0;
    }

    public get length(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    public static add(vector1: Vector, vector2: Vector): Vector {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    public static sub(vector1: Vector, vector2: Vector): Vector {
        return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
    }

    public static multiply(vector1: Vector, vector2: Vector): number {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }

    public static multiplyScalar(vector: Vector, scalar: number): Vector {
        return new Vector(vector.x * scalar, vector.y * scalar);
    }

    public static reverse(vector: Vector): Vector {
        return new Vector(-vector.x, -vector.y);
    }

    public static fromPoints(point1: Point, point2: Point): Vector {
        return new Vector(point2.x - point1.x, point2.y - point1.y);
    }
}

interface IVectorCollection {
    getSum(): Vector
}

/**
 * A collection storing multiple **anonymous** vectors
 * 
 * Cannot remove one single vector from the collection.
 * 
 * @extends {LinkedNodes<Vector>}
 */
export class VectorCollection extends LinkedNodes<Vector> implements IVectorCollection {
    public constructor(iterable?: Iterable<Vector>) {
        super();

        if(iterable) {
            for(const item of iterable) {
                this.push(item);
            }
        }
    }

    public getSum() {
        let sum = Vector.Zero;

        for(const vector of this) {
            sum = Vector.add(sum, vector);
        }

        return sum;
    }
}
