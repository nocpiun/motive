import { Vector, VectorCollection } from "@/simulator/vector";

describe("vector-tests", () => {
    it("zero-vector", () => {
        const zero = Vector.Zero;

        expect(zero.x).toBe(0);
        expect(zero.y).toBe(0);
        expect(zero.length).toBe(0);
    });

    it("get-unit-vector", () => {
        const vector1 = Vector.Zero;
        const vector2 = new Vector(3, 4);

        expect(vector1.getUnitVector()).toBe(Vector.Zero);
        expect(vector2.getUnitVector()).toEqual(new Vector(0.6, 0.8));
    });

    it("vector-length", () => {
        const vector = new Vector(3, 4);

        expect(vector.length).toBe(5);
    });

    it("vector-addition", () => {
        const vector1 = new Vector(3, 4);
        const vector2 = new Vector(5, 6);

        expect(Vector.add(vector1, vector2)).toEqual(new Vector(8, 10));
    });

    it("vector-subtraction", () => {
        const vector1 = new Vector(3, 4);
        const vector2 = new Vector(5, 6);

        expect(Vector.sub(vector1, vector2)).toEqual(new Vector(-2, -2));
    });

    it("vector-multiplication", () => {
        const vector1 = new Vector(3, 4);
        const vector2 = new Vector(5, 6);

        // 3 * 5 + 4 * 6 = 39
        expect(Vector.multiply(vector1, vector2)).toBe(39);
    });

    it("vector-multiply-scalar", () => {
        const vector = new Vector(3, 4);

        expect(Vector.multiplyScalar(vector, 100)).toEqual(new Vector(300, 400));
    });

    it("vector-reverse", () => {
        const vector = new Vector(3, 4);

        expect(Vector.reverse(vector)).toEqual(new Vector(-3, -4));
    });

    it("vector-from-2-points", () => {
        const point1 = new Vector(3, 4);
        const point2 = new Vector(5, 6);

        expect(Vector.fromPoints(point1, point2)).toEqual(new Vector(2, 2));
    });
});

describe("vector-collection-tests", () => {
    const vectors = new VectorCollection([
        new Vector(3, 4),
        new Vector(5, 6),
        new Vector(7, 8),
        new Vector(9, 10),
    ]);

    it("sum-of-vectors", () => {
        expect(vectors.getSum()).toEqual(new Vector(24, 28));
    });
});
