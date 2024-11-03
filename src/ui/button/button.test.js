"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lucide_1 = require("lucide");
const button_1 = require("./button");
describe("button-component-tests", () => {
    const button = new button_1.Button(document.body, { text: "Test1", variant: "primary" });
    const disabledButton = new button_1.Button(document.body, { text: "Test2", variant: "primary", disabled: true });
    const iconButton = new button_1.Button(document.body, { text: "Test3", variant: "secondary", icon: lucide_1.Menu });
    const iconOnlyButton = new button_1.Button(document.body, { variant: "secondary", icon: lucide_1.Menu });
    const tooltipButton = new button_1.Button(document.body, { text: "Test5", variant: "primary", tooltip: "Test Tooltip 1" });
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
    it("button-hover-tooltip", () => {
        tooltipButton.element.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
        expect(document.getElementById("hover-widget-provider").querySelector("#hover-widget-content").textContent).toBe("Test Tooltip 1");
        tooltipButton.element.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
        expect(document.getElementById("hover-widget-provider").childNodes.length).toBe(0);
    });
    it("set-button-icon", () => {
        iconButton.setIcon(lucide_1.List);
    });
    it("set-button-hover-tooltip", () => {
        tooltipButton.setTooltip("Test Tooltip 2");
        tooltipButton.element.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
        expect(document.getElementById("hover-widget-provider").querySelector("#hover-widget-content").textContent).toBe("Test Tooltip 2");
        tooltipButton.element.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    });
    it("button-dispose", () => {
        button.dispose();
        disabledButton.dispose();
        iconButton.dispose();
        iconOnlyButton.dispose();
        tooltipButton.dispose();
        expect(button.element).toBeNull();
        expect(disabledButton.element).toBeNull();
        expect(iconButton.element).toBeNull();
        expect(iconOnlyButton.element).toBeNull();
        expect(tooltipButton.element).toBeNull();
    });
});
