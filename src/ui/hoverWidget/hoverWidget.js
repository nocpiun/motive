"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoverWidget = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_1 = require("@/ui/ui");
require("./hoverWidget.less");
const defaultOptions = {
    text: "",
    anchor: {
        x: 0,
        y: 0
    },
    position: "bottom-right"
};
class HoverWidget extends ui_1.Component {
    constructor(target, _options) {
        super(((0, jsx_runtime_1.jsxs)("div", { className: "hover-widget", "data-position": _options.position, children: [_options.title && (0, jsx_runtime_1.jsx)("h1", { id: "hover-widget-title", children: _options.title }), (0, jsx_runtime_1.jsx)("span", { id: "hover-widget-content", children: _options.text })] })), target, defaultOptions, _options);
        if (this._options.id)
            this._element.id = this._options.id;
        const width = this._element.clientWidth;
        const height = this._element.clientHeight;
        switch (this._options.position) {
            case "top-left":
                this._element.style.left = (this._options.anchor.x - width) + "px";
                this._element.style.top = (this._options.anchor.y - height) + "px";
                break;
            case "top-right":
                this._element.style.left = this._options.anchor.x + "px";
                this._element.style.top = (this._options.anchor.y - height) + "px";
                break;
            case "bottom-left":
                this._element.style.left = (this._options.anchor.x - width) + "px";
                this._element.style.top = this._options.anchor.y + "px";
                break;
            case "bottom-right":
                this._element.style.left = this._options.anchor.x + "px";
                this._element.style.top = this._options.anchor.y + "px";
                break;
        }
        // Appearing animation
        this._element.style.opacity = "1";
    }
    set title(title) {
        this._options.title = title;
        this._element.querySelector("#hover-widget-title").textContent = title;
    }
    get title() {
        return this._options.title;
    }
    set text(text) {
        this._options.text = text;
        this._element.querySelector("#hover-widget-content").textContent = text;
    }
    get text() {
        return this._options.text;
    }
    get id() {
        return this._options.id;
    }
}
exports.HoverWidget = HoverWidget;
