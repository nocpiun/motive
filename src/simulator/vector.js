"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorCollection = exports.Vector = void 0;
const linkedNodes_1 = require("@/common/utils/linkedNodes");
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    multiply(vector) {
        return Vector.multiply(this, vector);
    }
    getUnitVector() {
        const length = this.length;
        if (length === 0) {
            return Vector.Zero;
        }
        return new Vector(this.x / length, this.y / length);
    }
    getComponent(n) {
        // v' = (n·v) * n (when |n| = 1)
        return Vector.multiplyScalar(n, n.multiply(this));
    }
    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    static add(vector1, vector2) {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    }
    static sub(vector1, vector2) {
        return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
    }
    static multiply(vector1, vector2) {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }
    static multiplyScalar(vector, scalar) {
        return new Vector(vector.x * scalar, vector.y * scalar);
    }
    static reverse(vector) {
        return new Vector(-vector.x, -vector.y);
    }
    static fromPoints(point1, point2) {
        return new Vector(point2.x - point1.x, point2.y - point1.y);
    }
}
exports.Vector = Vector;
Vector.Zero = new Vector(0, 0);
/**
 * A collection storing multiple **anonymous** vectors
 *
 * Cannot remove one single vector from the collection.
 *
 * @extends {LinkedNodes<Vector>}
 */
class VectorCollection extends linkedNodes_1.LinkedNodes {
    constructor(iterable) {
        super();
        if (iterable) {
            for (const item of iterable) {
                this.push(item);
            }
        }
    }
    getSum() {
        let sum = Vector.Zero;
        for (const vector of this) {
            sum = Vector.add(sum, vector);
        }
        return sum;
    }
}
exports.VectorCollection = VectorCollection;
