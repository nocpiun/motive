"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonGroup = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_1 = require("@/ui/ui");
const event_1 = require("@/common/event");
const switcher_1 = require("@/ui/switcher/switcher");
const button_1 = require("./button");
require("./button.less");
const defaultOptions = {
    variant: "secondary",
    disabled: false
};
class ButtonGroup extends ui_1.Component {
    constructor(target, _options) {
        super((0, jsx_runtime_1.jsx)("div", { class: "button-group" }), target, defaultOptions, _options);
        // events
        this._onDidChange = new event_1.Emitter();
        this._register(this._onDidChange);
    }
    addButton(options, onClick) {
        const button = new button_1.Button(this, options);
        button.element.classList.add("grouped");
        if (this._options.variant)
            button.variant = this._options.variant;
        if (this._options.disabled)
            button.disabled = true;
        if (onClick)
            button.onClick(onClick);
        this._register(button);
        this._onDidChange.fire(button);
        return button;
    }
    addSwitcher(options, onDidChange) {
        const switcher = new switcher_1.Switcher(this, options);
        switcher.element.classList.add("grouped");
        if (this._options.variant)
            switcher.variant = this._options.variant;
        if (this._options.disabled)
            switcher.disabled = true;
        if (onDidChange)
            switcher.onDidChange(onDidChange);
        this._register(switcher);
        this._onDidChange.fire(switcher);
        return switcher;
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
}
exports.ButtonGroup = ButtonGroup;
