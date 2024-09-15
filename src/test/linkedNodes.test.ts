import { LinkedNodes } from "@/common/utils/linkedNodes";

describe("linked-nodes-tests", () => {
    const nodes = LinkedNodes.from([1, 2, 3, "Hello", true]);

    it("create-linked-nodes-from-array", () => {
        expect(nodes.toArray()).toStrictEqual([1, 2, 3, "Hello", true]);
        expect(nodes.length).toBe(5);
    });

    it("is-linked-nodes-empty", () => {
        expect(nodes.isEmpty()).toBeFalsy();
        expect(LinkedNodes.empty().isEmpty()).toBeTruthy();
    });

    it("clear-linked-nodes", () => {
        const nodes1 = LinkedNodes.from([1, 2, 3]);

        nodes1.clear();

        expect(nodes1.toArray()).toStrictEqual([]);
    });

    it("linked-nodes-unshift", () => {
        nodes.unshift("World");

        expect(nodes.toArray()).toStrictEqual(["World", 1, 2, 3, "Hello", true]);
    });

    it("linked-nodes-push", () => {
        nodes.push(1000);

        expect(nodes.toArray()).toStrictEqual(["World", 1, 2, 3, "Hello", true, 1000]);
    });

    it("linked-nodes-shift", () => {
        expect(nodes.shift()).toBe("World");
        expect(nodes.toArray()).toStrictEqual([1, 2, 3, "Hello", true, 1000]);
    });

    it("linked-nodes-pop", () => {
        expect(nodes.pop()).toBe(1000);
        expect(nodes.toArray()).toStrictEqual([1, 2, 3, "Hello", true]);
    });

    it("remove-node-from-linked-nodes", () => {
        const node = nodes.push(123);

        expect(nodes.toArray()).toStrictEqual([1, 2, 3, "Hello", true, 123]);
        nodes.remove(node);
        expect(nodes.toArray()).toStrictEqual([1, 2, 3, "Hello", true]);
    });
});
