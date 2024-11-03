"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_1 = require("lucide");
const event_1 = require("@/common/event");
const ui_1 = require("@/ui/ui");
const hoverProvider_1 = require("@/ui/hoverWidget/hoverProvider");
require("./button.less");
const contextMenuProvider_1 = require("../contextMenu/contextMenuProvider");
const defaultOptions = {
    variant: "secondary",
    disabled: false,
    tooltipPosition: "bottom-right",
    contextMenuItems: []
};
class Button extends ui_1.Component {
    constructor(target, _options) {
        super(((0, jsx_runtime_1.jsxs)("button", { className: "button", onClick: (e) => {
                this._onClick.fire(e);
            }, children: [_options.icon
                    && ((0, jsx_runtime_1.jsx)("div", { className: "icon-wrapper", children: _options.icon && (0, lucide_1.createElement)(_options.icon) })), _options.text && (0, jsx_runtime_1.jsx)("span", { children: _options.text })] })), target, defaultOptions, _options);
        // events
        this._onClick = new event_1.Emitter();
        this._tooltipWidget = null;
        this._element.classList.add(`button-${this._options.variant}`);
        if (!this._options.text)
            this._element.classList.add("button-icon-only");
        if (this._options.disabled)
            this.disabled = this._options.disabled;
        if (this._options.width)
            this._element.style.width = `${this._options.width}px`;
        if (this._options.height)
            this._element.style.height = `${this._options.height}px`;
        if (this._options.id)
            this._element.id = this._options.id;
        if (this._options.contextMenuItems && this._options.contextMenuItems.length > 0 && !this._options.disabled) {
            contextMenuProvider_1.contextMenuProvider.registerContextMenu(this, this._options.contextMenuItems);
        }
        this._register(this._onClick);
        if (this._options.tooltip) {
            this._register(this.onHover(() => {
                const rect = this._element.getBoundingClientRect();
                this._tooltipWidget = hoverProvider_1.hoverProvider.createTextHoverWidget(this._options.tooltip, {
                    x: rect.left,
                    y: rect.top + rect.height,
                }, this._options.tooltipPosition);
            }));
            this._register(this.onUnhover(() => {
                hoverProvider_1.hoverProvider.clearHoverWidgets();
                this._tooltipWidget = null;
            }));
        }
    }
    set variant(variant) {
        this._element.classList.remove(`button-${this._options.variant}`);
        this._element.classList.add(`button-${variant}`);
        this._options.variant = variant;
    }
    get variant() {
        return this._options.variant;
    }
    set disabled(disabled) {
        disabled
            ? this._element.classList.add("button-disabled")
            : this._element.classList.remove("button-disabled");
        this._element.disabled = disabled;
        this._options.disabled = disabled;
    }
    get disabled() {
        return this._options.disabled;
    }
    get id() {
        return this._options.id;
    }
    setIcon(icon) {
        this._element.querySelector(".icon-wrapper").replaceChildren((0, lucide_1.createElement)(icon));
    }
    setTooltip(text) {
        this._options.tooltip = text;
        if (this._tooltipWidget)
            this._tooltipWidget.text = text;
    }
    get onClick() {
        return this._onClick.event;
    }
    dispose() {
        super.dispose();
        hoverProvider_1.hoverProvider.clearHoverWidgets();
        this._tooltipWidget = null;
    }
}
exports.Button = Button;
