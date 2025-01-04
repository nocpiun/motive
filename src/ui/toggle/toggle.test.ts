import { Toggle } from "./toggle";

describe("toggle-component-tests", () => {
    const toggle1 = new Toggle(document.body);
    const toggle2 = new Toggle(document.body, { defaultValue: true });
    const disabledToggle = new Toggle(document.body, { disabled: true });

    it("toggle-properties", () => {
        expect(toggle1.element.classList.contains("toggle")).toBeTruthy();
        expect(toggle2.element.classList.contains("toggle-active")).toBeTruthy();
        expect(disabledToggle.element.classList.contains("toggle-disabled")).toBeTruthy();
    });

    it("toggle-click", () => {
        toggle1.element.click();
        expect(toggle1.isActive).toBeTruthy();
        expect(toggle1.element.classList.contains("toggle-active")).toBeTruthy();

        toggle1.element.click();
        expect(toggle1.isActive).toBeFalsy();
        expect(toggle1.element.classList.contains("toggle-active")).toBeFalsy();

        disabledToggle.element.click();
        expect(disabledToggle.isActive).toBeFalsy();
        expect(disabledToggle.element.classList.contains("toggle-active")).toBeFalsy();
    });

    it("toggle-change", () => {
        let counter = 0;

        toggle1.onDidChange((isActive) => {
            if(isActive) counter++;
        });

        toggle1.element.click();
        expect(counter).toBe(1);
    });

    it("toggle-dispose", () => {
        toggle1.dispose();
        toggle2.dispose();
        disabledToggle.dispose();

        expect(toggle1.element).toBeNull();
        expect(toggle2.element).toBeNull();
        expect(disabledToggle.element).toBeNull();
    });
});
