import { Modal } from "./modal";
import { modalProvider } from "./modalProvider";

/** @see https://github.com/jsdom/jsdom/issues/3294#issuecomment-1196577616 */
beforeAll(() => {
    HTMLDialogElement.prototype.showModal = jest.fn(function() {
        this.open = true;
    });
    HTMLDialogElement.prototype.close = jest.fn(function() {
        this.open = false;
    });
});

describe("modal-component-tests", () => {
    const modal = new Modal(document.body, { id: "test", title: "Test Modal Dialog" });

    it("modal-properties", () => {
        expect(modal.element.classList.contains("modal-dialog")).toBeTruthy();
        expect(modal.element.id).toBe("test");
    });

    it("modal-content", () => {
        expect(modal.element.querySelector("h1").textContent).toBe("Test Modal Dialog");
        expect(modal.element.querySelector("footer").childNodes.length).toBe(1);
    });

    it("modal-show", () => {
        expect(modal.element.open).toBeFalsy();
        expect(modal.element.classList.contains("opened")).toBeFalsy();

        modal.show();

        expect(modal.element.open).toBeTruthy();
        expect(modal.element.classList.contains("opened")).toBeTruthy();
    });

    it("modal-close", () => {
        modal.close();

        expect(modal.element.open).toBeFalsy();
        expect(modal.element.classList.contains("opened")).toBeFalsy();
    });

    it("modal-dispose", () => {
        modal.dispose();

        expect(modal.element).toBeNull();
    });
});

describe("modal-provider-tests", () => {
    it("get-modal-provider", () => {
        expect(modalProvider).toBeDefined();
    });

    it("open-specific-modal", () => {
        expect(modalProvider.getCurrentModal()).toBeNull();

        modalProvider.open("test");

        const modal = modalProvider.getCurrentModal();
        expect(modal.element.open).toBeTruthy();
    });

    it("close-all-modals", () => {
        modalProvider.closeAll();

        expect(modalProvider.getCurrentModal()).toBeNull();
    });
});
