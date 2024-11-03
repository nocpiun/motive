"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("@/simulator/vector");
describe("vector-tests", () => {
    it("zero-vector", () => {
        const zero = vector_1.Vector.Zero;
        expect(zero.x).toBe(0);
        expect(zero.y).toBe(0);
        expect(zero.length).toBe(0);
    });
    it("get-unit-vector", () => {
        const vector1 = vector_1.Vector.Zero;
        const vector2 = new vector_1.Vector(3, 4);
        expect(vector1.getUnitVector()).toBe(vector_1.Vector.Zero);
        expect(vector2.getUnitVector()).toEqual(new vector_1.Vector(0.6, 0.8));
    });
    it("vector-length", () => {
        const vector = new vector_1.Vector(3, 4);
        expect(vector.length).toBe(5);
    });
    it("vector-addition", () => {
        const vector1 = new vector_1.Vector(3, 4);
        const vector2 = new vector_1.Vector(5, 6);
        expect(vector_1.Vector.add(vector1, vector2)).toEqual(new vector_1.Vector(8, 10));
    });
    it("vector-subtraction", () => {
        const vector1 = new vector_1.Vector(3, 4);
        const vector2 = new vector_1.Vector(5, 6);
        expect(vector_1.Vector.sub(vector1, vector2)).toEqual(new vector_1.Vector(-2, -2));
    });
    it("vector-multiplication", () => {
        const vector1 = new vector_1.Vector(3, 4);
        const vector2 = new vector_1.Vector(5, 6);
        // 3 * 5 + 4 * 6 = 39
        expect(vector_1.Vector.multiply(vector1, vector2)).toBe(39);
    });
    it("vector-multiply-scalar", () => {
        const vector = new vector_1.Vector(3, 4);
        expect(vector_1.Vector.multiplyScalar(vector, 100)).toEqual(new vector_1.Vector(300, 400));
    });
    it("vector-reverse", () => {
        const vector = new vector_1.Vector(3, 4);
        expect(vector_1.Vector.reverse(vector)).toEqual(new vector_1.Vector(-3, -4));
    });
    it("vector-from-2-points", () => {
        const point1 = new vector_1.Vector(3, 4);
        const point2 = new vector_1.Vector(5, 6);
        expect(vector_1.Vector.fromPoints(point1, point2)).toEqual(new vector_1.Vector(2, 2));
    });
});
describe("vector-collection-tests", () => {
    const vectors = new vector_1.VectorCollection([
        new vector_1.Vector(3, 4),
        new vector_1.Vector(5, 6),
        new vector_1.Vector(7, 8),
        new vector_1.Vector(9, 10),
    ]);
    it("sum-of-vectors", () => {
        expect(vectors.getSum()).toEqual(new vector_1.Vector(24, 28));
    });
});
