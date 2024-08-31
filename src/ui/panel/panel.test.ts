import { Panel } from "./panel";

describe("panel-component-tests", () => {
    const panel = new Panel(document.body);

    it("panel-properties", () => {
        expect(panel.element.classList.contains("panel")).toBeTruthy();
    });
});
