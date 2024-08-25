import { Button } from "./button";

describe("button-component-tests", () => {
    const button = new Button("test");

    it("button-properties", () => {
        expect(button.text).toBe("test");
        expect(button.element.className).toStrictEqual("button");
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
