import { Canvas } from "./canvas";

describe("canvas-component-tests", () => {
    const canvas = new Canvas(document.body);

    it("canvas-properties", () => {
        expect(canvas.element.classList.contains("motive-canvas-container")).toBeTruthy();
    });

    it("canvas-dispose", () => {
        canvas.dispose();

        expect(canvas.element).toBeNull();
    });
});
