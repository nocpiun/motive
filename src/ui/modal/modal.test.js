"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testModal_1 = require("./testModal");
const modalProvider_1 = require("./modalProvider");
/** @see https://github.com/jsdom/jsdom/issues/3294#issuecomment-1196577616 */
beforeAll(() => {
    HTMLDialogElement.prototype.show = jest.fn(function () {
        this.open = true;
    });
    HTMLDialogElement.prototype.close = jest.fn(function () {
        this.open = false;
    });
});
describe("modal-component-tests", () => {
    const modal = new testModal_1.TestModal(document.body);
    it("modal-properties", () => {
        expect(modal.element.classList.contains("modal-dialog")).toBeTruthy();
        expect(modal.element.id).toBe("test");
        expect(modal.element.open).toBeFalsy();
        expect(modal.element.classList.contains("opened")).toBeFalsy();
    });
    it("modal-content", () => {
        expect(modal.element.querySelector(".modal-dialog-title").textContent).toBe("Test Modal");
        expect(modal.element.querySelector(".footer-right-split").childNodes.length).toBe(1);
        expect(modal.element.querySelector(".footer-left-split").childNodes.length).toBe(1);
        expect(document.getElementById("modal.test.test-btn-1").textContent).toBe("Test Footer Button 1");
        expect(document.getElementById("modal.test.test-btn-2").textContent).toBe("Test Footer Button 2");
    });
    it("modal-show", () => {
        let counter = 0;
        modal.onShow(() => {
            counter++;
        });
        modal.show();
        expect(modal.element.open).toBeTruthy();
        expect(modal.element.classList.contains("opened")).toBeTruthy();
        expect(counter).toBe(1);
    });
    it("modal-set-title", () => {
        modal.changeTitle();
        expect(modal.element.querySelector(".modal-dialog-title").textContent).toBe("Changed Test Modal");
    });
    it("modal-close", () => {
        let counter = 0;
        modal.onClose(() => {
            counter++;
        });
        modal.close();
        expect(modal.element.open).toBeFalsy();
        expect(modal.element.classList.contains("opened")).toBeFalsy();
        expect(counter).toBe(1);
    });
    it("modal-show-with-data", () => {
        let counter = 0;
        modal.onShow(({ num }) => {
            counter += num;
        });
        modal.show({ num: 10 });
        expect(modal.element.open).toBeTruthy();
        expect(modal.element.classList.contains("opened")).toBeTruthy();
        expect(counter).toBe(10);
        modal.close();
    });
    it("modal-dispose", () => {
        modal.dispose();
        expect(modal.element).toBeNull();
    });
});
describe("modal-provider-tests", () => {
    it("get-modal-provider", () => {
        expect(modalProvider_1.modalProvider).toBeDefined();
    });
    it("open-specific-modal", () => {
        expect(modalProvider_1.modalProvider.getCurrentModal()).toBeNull();
        modalProvider_1.modalProvider.open("test");
        const modal = modalProvider_1.modalProvider.getCurrentModal();
        expect(modal.element.open).toBeTruthy();
        modalProvider_1.modalProvider.open("test"); // open modal twice times
        expect(modal.element.open).toBeTruthy();
        modalProvider_1.modalProvider.closeAll();
    });
    it("open-specific-modal-with-data", () => {
        modalProvider_1.modalProvider.open("test", { num: 10 });
        const modal = modalProvider_1.modalProvider.getCurrentModal();
        expect(modal.element.open).toBeTruthy();
        expect(modal.data).toStrictEqual({ num: 10 });
    });
    it("close-all-modals", () => {
        modalProvider_1.modalProvider.closeAll();
        expect(modalProvider_1.modalProvider.getCurrentModal()).toBeNull();
    });
});
