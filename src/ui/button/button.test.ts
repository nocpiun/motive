import { Button } from "./button";

describe("button-component-tests", () => {
    const button = new Button("Test");

    it("button-properties", () => {
        expect(button.text).toBe("Test");
        expect(Array.from(button.element.classList)).toStrictEqual(["button", "button-primary"]);
    });

    it("button-click", () => {
        let counter = 0;

        button.onClick(() => {
            counter++;
        });

        button.element.click();
        expect(counter).toBe(1);
    });

    it("button-dispose", () => {
        button.dispose();

        expect(button.element).toBeNull();
    });
});
