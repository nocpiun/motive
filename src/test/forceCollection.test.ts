import { Force, ForceCollection } from "@/simulator/force";

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

    it("add-force", () => {
        forces.add("test.5", new Force(11, 12));

        expect(forces.has("test.5")).toBeTruthy();
    });

    it("remove-force", () => {
        forces.remove("test.5");

        expect(forces.has("test.5")).toBeFalsy();
    });

    it("sum-of-forces", () => {
        expect(forces.getSum()).toEqual(new Force(24, 28));
    });

    it("clear-forces", () => {
        forces.clear();

        expect(forces.getSum()).toEqual(Force.Zero);
    });
});
