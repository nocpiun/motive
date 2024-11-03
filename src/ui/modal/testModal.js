"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestModal = void 0;
const modal_1 = require("./modal");
/**
 * A modal dialog for testing. Only used in test environment.
 */
class TestModal extends modal_1.Modal {
    constructor(target) {
        if (process.env.NODE_ENV !== "test") {
            throw new Error("TestModal can only be used in test environment.");
        }
        super(target, { id: "test", title: "Test Modal", width: 300, height: 200 });
        this._addFooterButton("test-btn-1", { text: "Test Footer Button 1" }, "right", () => { });
        this._addFooterButton("test-btn-2", { text: "Test Footer Button 2" }, "left", () => { });
        this._register(this.onShow((data) => {
            this.data = data;
        }));
    }
    changeTitle() {
        this._setTitle("Changed Test Modal");
    }
}
exports.TestModal = TestModal;
