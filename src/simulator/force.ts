import { gravity as g } from "@/common/global";

import { Vector, type IVector } from "./vector";

interface IForce extends IVector {
    getAccelerate(mass: number): Vector
    setSize(size: number): void
    setToZero(): void
}

export class Force extends Vector implements IForce {
    public static readonly Zero = new Force(0, 0);

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

interface IForceCollection {
    has(key: string): boolean
    add(key: string, force: Force): void
    get(key: string): Force
    set(key: string, force: Force): void
    remove(key: string): void
    clear(): void
    getSum(): Force
}

/**
 * A collection storing multiple vectors with their keys
 * 
 * It is a wrapper of `Map<string, Vector>`.
 * 
 * **Note:** `ForceCollection` is unrelated to `VectorCollection`.
 */
export class ForceCollection implements IForceCollection {
    private _map: Map<string, Force>;

    public constructor(iterable?: Iterable<readonly [string, Force]>) {
        this._map = new Map(iterable);
    }

    public has(key: string) {
        return this._map.has(key);
    }

    public add(key: string, force: Force) {
        this._map.set(key, force);
    }

    public get(key: string) {
        return this._map.get(key);
    }

    public set(key: string, force: Force) {
        // We shouldn't combine `set()` with `add()`,
        // because this may lead to some chaotic issues.
        if(!this._map.has(key)) throw new Error("Cannot set an inexistent force.");

        this._map.set(key, force);
    }

    public remove(key: string) {
        if(!this._map.has(key)) return;

        this._map.delete(key);
    }

    public clear() {
        this._map.clear();
    }

    public getSum() {
        let sum = Force.Zero;

        for(const force of this._map.values()) {
            sum = Force.add(sum, force);
        }

        return sum;
    }
}
