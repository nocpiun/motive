import { LinkedNodes } from "@/common/utils/linkedNodes"

interface IVector {
    x: number
    y: number

    multiply(vector: IVector): number
    get length(): number
}

export class Vector implements IVector {
    public static readonly Zero = new Vector(0, 0);

    public constructor(public x: number, public y: number) { }

    public multiply(vector: Vector): number {
        return Vector.multiply(this, vector);
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

    public static createUnitVector(angle: number): Vector {
        const fixedAngle = parseFloat(angle.toFixed(3));

        return new Vector(Math.round(Math.cos(fixedAngle)), Math.round(Math.sin(fixedAngle)));
    }
}

export class VectorCollection extends LinkedNodes<Vector> {
    public constructor(iterable?: Iterable<Vector>) {
        super();

        if(iterable) {
            for(const item of iterable) {
                this.push(item);
            }
        }
    }

    public getSum(): Vector {
        let sum = Vector.Zero;

        for(const vector of this) {
            sum = Vector.add(sum, vector);
        }

        return sum;
    }
}
