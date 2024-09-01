import { Switcher } from "./switcher";

describe("switcher-component-tests", () => {
    const switcher1 = new Switcher(document.body, { text: "Test1" });
    const switcher2 = new Switcher(document.body, { text: "Test2", defaultValue: true });

    it("switcher-properties", () => {
        expect(switcher1.element.classList.contains("switcher")).toBeTruthy();
        expect(switcher2.element.classList.contains("switcher-active")).toBeTruthy();
    });

    it("switcher-toggle", () => {
        switcher1.element.click();
        expect(switcher1.isActive).toBeTruthy();
        expect(switcher1.element.classList.contains("switcher-active")).toBeTruthy();

        switcher1.element.click();
        expect(switcher1.isActive).toBeFalsy();
        expect(switcher1.element.classList.contains("switcher-active")).toBeFalsy();
    });

    it("switcher-toggle-change", () => {
        let counter = 0;

        switcher1.onDidChange(({ isActive }) => {
            if(isActive) counter++;
        });

        switcher1.element.click();
        expect(counter).toBe(1);
    });

    it("switcher-dispose", () => {
        switcher1.dispose();
        switcher2.dispose();

        expect(switcher1.element).toBeNull();
        expect(switcher2.element).toBeNull();
    });
});
