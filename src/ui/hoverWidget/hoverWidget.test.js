"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hoverProvider_1 = require("./hoverProvider");
const hoverWidget_1 = require("./hoverWidget");
describe("hover-widget-component-tests", () => {
    const hoverWidget = new hoverWidget_1.HoverWidget(document.body, { text: "test 1", anchor: { x: 50, y: 40 }, position: "bottom-right" });
    const hoverWidgetWithTitle = new hoverWidget_1.HoverWidget(document.body, { title: "Test Title", text: "test 2", anchor: { x: 50, y: 40 }, position: "bottom-left" });
    it("hover-widget-properties", () => {
        expect(Array.from(hoverWidget.element.classList)).toStrictEqual(["hover-widget"]);
        expect(Array.from(hoverWidgetWithTitle.element.classList)).toStrictEqual(["hover-widget"]);
        expect(hoverWidget.element.getAttribute("data-position")).toBe("bottom-right");
        expect(hoverWidgetWithTitle.element.getAttribute("data-position")).toBe("bottom-left");
    });
    it("hover-widget-text", () => {
        expect(hoverWidget.text).toBe("test 1");
        expect(hoverWidget.element.querySelector("#hover-widget-content").textContent).toBe("test 1");
        expect(hoverWidget.title).toBeUndefined();
        expect(hoverWidget.element.querySelector("#hover-widget-title")).toBeNull();
        expect(hoverWidgetWithTitle.text).toBe("test 2");
        expect(hoverWidgetWithTitle.element.querySelector("#hover-widget-content").textContent).toBe("test 2");
        expect(hoverWidgetWithTitle.title).toBe("Test Title");
        expect(hoverWidgetWithTitle.element.querySelector("#hover-widget-title").textContent).toBe("Test Title");
    });
    it("hover-widget-position", () => {
        expect(hoverWidget.element.style.top).toBe("40px");
        expect(hoverWidget.element.style.left).toBe("50px");
        expect(hoverWidgetWithTitle.element.style.top).toBe("40px");
        expect(hoverWidgetWithTitle.element.style.left).toBe("50px");
    });
    it("hover-widget-dispose", () => {
        hoverWidget.dispose();
        hoverWidgetWithTitle.dispose();
        expect(hoverWidget.element).toBeNull();
        expect(hoverWidgetWithTitle.element).toBeNull();
    });
});
describe("hover-widget-provider-tests", () => {
    it("get-hover-provider", () => {
        expect(hoverProvider_1.hoverProvider).toBeDefined();
    });
    it("create-text-hover-widget", () => {
        const hoverWidget = hoverProvider_1.hoverProvider.createTextHoverWidget("test 1", { x: 50, y: 40 }, "bottom-right");
        expect(hoverWidget.text).toBe("test 1");
        expect(hoverWidget.id).toBeDefined();
        expect(document.getElementById("hover-widget-provider").childNodes.length).toBe(1);
        hoverWidget.text = "changed text";
        expect(hoverWidget.text).toBe("changed text");
        expect(document.getElementById("hover-widget-content").textContent).toBe("changed text");
    });
    it("create-text-hover-widget-with-title", () => {
        const hoverWidgetWithTitle = hoverProvider_1.hoverProvider.createTitleTextHoverWidget("Test Title", "test 2", { x: 50, y: 40 }, "bottom-right");
        expect(hoverWidgetWithTitle.text).toBe("test 2");
        expect(hoverWidgetWithTitle.title).toBe("Test Title");
        expect(hoverWidgetWithTitle.id).toBeDefined();
        expect(document.getElementById("hover-widget-provider").childNodes.length).toBe(2);
        hoverWidgetWithTitle.title = "changed title";
        expect(hoverWidgetWithTitle.title).toBe("changed title");
        expect(document.getElementById("hover-widget-title").textContent).toBe("changed title");
    });
    it("clear-hover-widgets", () => {
        hoverProvider_1.hoverProvider.clearHoverWidgets();
        expect(document.getElementById("hover-widget-provider").childNodes.length).toBe(0);
    });
});
