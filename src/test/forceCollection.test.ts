import { Force, ForceCollection } from "@/simulator/force";
import { Vector } from "@/simulator/vector";

describe("force-collection-tests", () => {
    const forces = new ForceCollection([
        ["test.1", new Force(3, 4)],
        ["test.2", new Force(5, 6)],
        ["test.3", new Force(7, 8)],
        ["test.4", new Force(9, 10)],
    ]);

    it("has-force", () => {
        expect(forces.has("test.1")).toBeTruthy();
        expect(forces.has("test.5")).toBeFalsy();
    });

    it("get-force", () => {
        expect(forces.get("test.4")).toEqual(new Force(9, 10));
    });

    it("set-force", () => {
        forces.set("test.5", new Force(11, 12));

        expect(forces.has("test.5")).toBeTruthy();
    });

    it("remove-force", () => {
        forces.remove("test.5");

        expect(forces.has("test.5")).toBeFalsy();
    });

    it("sum-of-forces", () => {
        expect(forces.getSum()).toEqual(new Force(24, 28));
    });

    it("get-component-force", () => {
        expect(forces.getComponent(new Vector(0, 1))).toEqual(new Force(0, 28));
    });

    it("clear-forces", () => {
        forces.clear();

        expect(forces.getSum()).toEqual(Force.Zero);
    });
});
