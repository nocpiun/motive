import { Switcher } from "./switcher";

describe("switcher-component-tests", () => {
    const switcher = new Switcher(document.body, { text: "Test" });

    it("switcher-properties", () => {
        expect(switcher.element.classList.contains("switcher")).toBeTruthy();
    });

    it("switcher-toggle", () => {
        switcher.element.click();
        expect(switcher.isActive).toBeTruthy();
        expect(switcher.element.classList.contains("switcher-active")).toBeTruthy();

        switcher.element.click();
        expect(switcher.isActive).toBeFalsy();
        expect(switcher.element.classList.contains("switcher-active")).toBeFalsy();
    });

    it("switcher-toggle-change", () => {
        switcher.onDidChange((isActive) => {
            expect(isActive).toBeTruthy();
        });

        switcher.element.click();
    });

    it("switcher-dispose", () => {
        switcher.dispose();

        expect(switcher.element).toBeNull();
    });
});
