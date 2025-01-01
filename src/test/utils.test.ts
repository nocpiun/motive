import { deepClone } from "@/common/utils/utils";

describe("utils-tests", () => {
    it("deep-clone", () => {
        const obj = {
            a: 1,
            b: {
                c: 2,
                d: 3
            }
        };

        const cloned = deepClone(obj);

        expect(cloned).not.toBe(obj);
        expect(cloned).toStrictEqual(obj);
        expect(cloned.b).not.toBe(obj.b);
        expect(cloned.b).toStrictEqual(obj.b);

        expect(deepClone(null)).toBeNull();
        expect(deepClone(300)).toBe(300);
        expect(deepClone(NaN)).toBeNaN();
        expect(deepClone("test")).toBe("test");
        expect(deepClone(true)).toBeTruthy();
        expect(deepClone(undefined)).toBeUndefined();

        const date = new Date(0);
        const clonedDate = deepClone(date);

        expect(clonedDate).not.toBe(date);
        expect(clonedDate).toStrictEqual(date);
    });
});
