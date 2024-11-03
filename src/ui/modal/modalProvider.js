"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modalProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const provider_1 = require("@/ui/provider");
const event_1 = require("@/common/event");
// Modals
const testModal_1 = require("./testModal");
const settingsModal_1 = require("./settingsModal");
const managerModal_1 = require("./managerModal");
const aboutModal_1 = require("./aboutModal");
const objectModal_1 = require("./objectModal");
class ModalProvider extends provider_1.Provider {
    constructor() {
        super("modal-provider");
        // events
        this._onModalOpen = new event_1.Emitter();
        this._onModalClose = new event_1.Emitter();
        this._currentModalId = null;
        document.body.appendChild((0, jsx_runtime_1.jsx)("div", { className: "modal-dialog-backdrop", id: "dialog-backdrop", onContextMenu: (e) => e.preventDefault() }));
        process.env.NODE_ENV === "test" && this._registerModal(testModal_1.TestModal);
        this._registerModal(settingsModal_1.SettingsModal);
        this._registerModal(managerModal_1.ManagerModal);
        this._registerModal(aboutModal_1.AboutModal);
        this._registerModal(objectModal_1.ObjectModal);
        this._register(this._onModalOpen);
        this._register(this._onModalClose);
    }
    _registerModal(modal) {
        const instance = new modal(this._providerElement);
        this._registerComponent(instance.id, instance);
        this._register(instance.onClose(() => {
            this._onModalClose.fire();
        }));
    }
    open(id, data) {
        if (this._currentModalId) {
            this._getComponent(this._currentModalId).close();
        }
        this._getComponent(id).show(data);
        this._currentModalId = id;
        this._onModalOpen.fire(id);
    }
    closeAll() {
        this._components.forEach((modal) => modal.close());
        this._currentModalId = null;
        this._onModalClose.fire();
    }
    getCurrentModal() {
        if (!this._currentModalId)
            return null;
        return this._getComponent(this._currentModalId);
    }
    get onModalOpen() {
        return this._onModalOpen.event;
    }
    get onModalClose() {
        return this._onModalClose.event;
    }
}
exports.modalProvider = (0, provider_1.registerProvider)(ModalProvider);
