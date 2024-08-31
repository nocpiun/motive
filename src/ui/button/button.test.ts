import { Menu } from "lucide";

import { Button } from "./button";

describe("button-component-tests", () => {
    const button = new Button(document.body, { text: "Test1", variant: "primary" });
    const disabledButton = new Button(document.body, { text: "Test2", variant: "primary", disabled: true });
    const iconButton = new Button(document.body, { text: "Test3", variant: "secondary", icon: Menu });
    const iconOnlyButton = new Button(document.body, { variant: "secondary", icon: Menu });

    it("button-properties", () => {
        expect(Array.from(button.element.classList)).toStrictEqual(["button", "button-primary"]);
        expect(button.element.disabled).toBeFalsy();

        expect(disabledButton.element.classList.contains("button-disabled")).toBeTruthy();
        expect(disabledButton.element.disabled).toBeTruthy();

        expect(iconButton.element.classList.contains("button-secondary")).toBeTruthy();
        expect(iconButton.element.getElementsByTagName("svg").length).toBe(1);

        expect(iconOnlyButton.element.classList.contains("button-icon-only")).toBeTruthy();
        expect(iconOnlyButton.element.getElementsByTagName("svg").length).toBe(1);
    });

    it("button-click", () => {
        let counter = 0;

        button.onClick(() => {
            counter++;
        });

        button.element.click();
        expect(counter).toBe(1);
    });

    it("disabled-button-click", () => {
        let counter = 0;

        disabledButton.onClick(() => {
            counter++;
        });

        disabledButton.element.click();
        expect(counter).toBe(0);
    });

    it("button-dispose", () => {
        button.dispose();
        disabledButton.dispose();
        iconButton.dispose();
        iconOnlyButton.dispose();

        expect(button.element).toBeNull();
        expect(disabledButton.element).toBeNull();
        expect(iconButton.element).toBeNull();
        expect(iconOnlyButton.element).toBeNull();
    });
});
