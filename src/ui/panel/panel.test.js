"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const panel_1 = require("./panel");
describe("panel-component-tests", () => {
    const panel = new panel_1.Panel(document.body);
    it("panel-properties", () => {
        expect(panel.element.classList.contains("panel")).toBeTruthy();
    });
    it("panel-dispose", () => {
        panel.dispose();
        expect(panel.element).toBeNull();
    });
});
