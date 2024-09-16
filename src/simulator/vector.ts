interface IVector {
    x: number
    y: number

    add(vector: IVector): void
    sub(vector: IVector): void
    multiplyScalar(scalar: number): void
    multiply(vector: IVector): number
    get length(): number
}

export class Vector implements IVector {
    public static readonly Zero = new Vector(0, 0);

    public constructor(public x: number, public y: number) { }

    public add(vector: Vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    public sub(vector: Vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    public multiplyScalar(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
    }

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

    public static createUnitVector(angle: number): Vector {
        return new Vector(Math.cos(angle), Math.sin(angle));
    }
}
