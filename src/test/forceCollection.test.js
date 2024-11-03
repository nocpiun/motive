"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const force_1 = require("@/simulator/force");
describe("force-collection-tests", () => {
    const forces = new force_1.ForceCollection([
        ["test.1", new force_1.Force(3, 4)],
        ["test.2", new force_1.Force(5, 6)],
        ["test.3", new force_1.Force(7, 8)],
        ["test.4", new force_1.Force(9, 10)],
    ]);
    it("has-force", () => {
        expect(forces.has("test.1")).toBeTruthy();
        expect(forces.has("test.5")).toBeFalsy();
    });
    it("add-force", () => {
        forces.add("test.5", new force_1.Force(11, 12));
        expect(forces.has("test.5")).toBeTruthy();
    });
    it("remove-force", () => {
        forces.remove("test.5");
        expect(forces.has("test.5")).toBeFalsy();
    });
    it("sum-of-forces", () => {
        expect(forces.getSum()).toEqual(new force_1.Force(24, 28));
    });
    it("clear-forces", () => {
        forces.clear();
        expect(forces.getSum()).toEqual(force_1.Force.Zero);
    });
});
