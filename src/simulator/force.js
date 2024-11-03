"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForceCollection = exports.Force = void 0;
const global_1 = require("@/common/global");
const vector_1 = require("./vector");
class Force extends vector_1.Vector {
    constructor(x, y) {
        super(x, y);
    }
    getAccelerate(mass) {
        return vector_1.Vector.multiplyScalar(this, 1 / mass);
    }
    setSize(size) {
        const length = this.length; // To avoid duplicated calculation of vector length
        const sin = this.y / length;
        const cos = this.x / length;
        this.x = size * cos;
        this.y = size * sin;
    }
    setToZero() {
        this.x = this.y = 0;
    }
    static gravity(mass) {
        return new Force(0, -mass * global_1.gravity);
    }
    static from(vector) {
        return new Force(vector.x, vector.y);
    }
    static add(vector1, vector2) {
        return new Force(vector1.x + vector2.x, vector1.y + vector2.y);
    }
    static sub(vector1, vector2) {
        return new Force(vector1.x - vector2.x, vector1.y - vector2.y);
    }
    static multiplyScalar(vector, scalar) {
        return new Force(vector.x * scalar, vector.y * scalar);
    }
    static reverse(vector) {
        return new Force(-vector.x, -vector.y);
    }
}
exports.Force = Force;
Force.Zero = new Force(0, 0);
/**
 * A collection storing multiple vectors with their keys
 *
 * It is a wrapper of `Map<string, Vector>`.
 *
 * **Note:** `ForceCollection` is unrelated to `VectorCollection`.
 */
class ForceCollection {
    constructor(iterable) {
        this._map = new Map(iterable);
    }
    has(key) {
        return this._map.has(key);
    }
    add(key, force) {
        this._map.set(key, force);
    }
    get(key) {
        return this._map.get(key);
    }
    set(key, force) {
        // We shouldn't combine `set()` with `add()`,
        // because this may lead to some chaotic issues.
        if (!this._map.has(key))
            throw new Error("Cannot set an inexistent force.");
        this._map.set(key, force);
    }
    remove(key) {
        if (!this._map.has(key))
            return;
        this._map.delete(key);
    }
    clear() {
        this._map.clear();
    }
    getSum() {
        let sum = Force.Zero;
        for (const force of this._map.values()) {
            sum = Force.add(sum, force);
        }
        return sum;
    }
}
exports.ForceCollection = ForceCollection;
