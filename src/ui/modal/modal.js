"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_1 = require("lucide");
const event_1 = require("@/common/event");
const ui_1 = require("@/ui/ui");
const button_1 = require("@/ui/button/button");
require("./modal.less");
const defaultOptions = {
    id: "",
    title: "",
    width: 500,
    height: 400
};
class Modal extends ui_1.Component {
    constructor(target, _options) {
        super(((0, jsx_runtime_1.jsxs)("dialog", { className: "modal-dialog", id: _options.id, children: [(0, jsx_runtime_1.jsxs)("header", { className: "modal-dialog-header", children: [(0, jsx_runtime_1.jsx)("span", { className: "modal-dialog-title", children: _options.title }), (0, jsx_runtime_1.jsx)("button", { className: "modal-dialog-close-button", id: `modal.${_options.id}.close`, onClick: () => this.close(), children: (0, lucide_1.createElement)(lucide_1.X) })] }), (0, jsx_runtime_1.jsx)("div", { className: "modal-dialog-body" }), (0, jsx_runtime_1.jsxs)("footer", { className: "modal-dialog-footer", children: [(0, jsx_runtime_1.jsx)("div", { className: "footer-left-split" }), (0, jsx_runtime_1.jsx)("div", { className: "footer-right-split" })] })] })), target, defaultOptions, _options);
        // events
        this._onShow = new event_1.Emitter();
        this._onClose = new event_1.Emitter();
        if (this._options.width)
            this._element.style.width = `${this._options.width}px`;
        if (this._options.height)
            this._element.style.height = `${this._options.height}px`;
        this._container = this._element.querySelector(".modal-dialog-body");
        this._register(this._onShow);
        this._register(this._onClose);
    }
    get id() {
        return this._options.id;
    }
    show(data) {
        this._element.classList.add("opened");
        document.getElementById("dialog-backdrop").classList.add("active");
        this._element.show();
        this._onShow.fire(data);
    }
    close() {
        this._element.classList.remove("opened");
        document.getElementById("dialog-backdrop").classList.remove("active");
        this._element.close();
        this._onClose.fire();
    }
    _setTitle(title) {
        this._options.title = title;
        this._element.querySelector(".modal-dialog-title").textContent = title;
    }
    _addFooterButton(id, options, dock = "right", onClick) {
        const button = new button_1.Button(this._element.querySelector(`.footer-${dock}-split`), Object.assign(Object.assign({}, options), { id: `modal.${this._options.id}.${id}` }));
        button.element.classList.add("modal-dialog-button");
        if (onClick)
            button.onClick(onClick);
        this._register(button);
        return button;
    }
    get onShow() {
        return this._onShow.event;
    }
    get onClose() {
        return this._onClose.event;
    }
    dispose() {
        this.close();
        super.dispose();
    }
}
exports.Modal = Modal;
