"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("./canvas");
describe("canvas-component-tests", () => {
    const canvas = new canvas_1.Canvas(document.body);
    it("canvas-properties", () => {
        expect(canvas.element.classList.contains("motive-canvas-container")).toBeTruthy();
    });
    it("canvas-dispose", () => {
        canvas.dispose();
        expect(canvas.element).toBeNull();
    });
});
