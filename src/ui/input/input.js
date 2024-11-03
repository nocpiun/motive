"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const event_1 = require("@/common/event");
const ui_1 = require("@/ui/ui");
require("./input.less");
const defaultOptions = {
    type: "text",
    placeholder: "",
    defaultValue: "",
    disabled: false,
    maxLength: Infinity,
    maxValue: Infinity
};
class Input extends ui_1.Component {
    constructor(target, _options) {
        super(((0, jsx_runtime_1.jsx)("input", { className: "input", onChange: () => {
                this._onDidChange.fire(this.value);
            }, onInput: (e) => {
                if (!this._validate(this.value)) {
                    e.preventDefault();
                    this.value = this.value.substring(0, this.value.length - 1);
                    return;
                }
                this._onInput.fire(this.value);
            } })), target, defaultOptions, _options);
        // events
        this._onInput = new event_1.Emitter();
        this._onDidChange = new event_1.Emitter();
        this._element.setAttribute("data-type", this._options.type);
        if (this._options.placeholder)
            this._element.placeholder = this._options.placeholder;
        if (this._options.defaultValue)
            this.value = this._options.defaultValue;
        if (this._options.disabled)
            this.disabled = this._options.disabled;
        if (this._options.width)
            this._element.style.width = `${this._options.width}px`;
        if (this._options.height)
            this._element.style.height = `${this._options.height}px`;
        if (this._options.id)
            this._element.id = this._options.id;
        this._register(this._onInput);
        this._register(this._onDidChange);
    }
    _validate(value) {
        if (value.length > this._options.maxLength)
            return false;
        switch (this._options.type) {
            case "text":
                return true;
            case "number": {
                const num = Number(value);
                if (isNaN(num))
                    return false;
                if (num > this._options.maxValue)
                    return false;
                return true;
            }
        }
    }
    set value(value) {
        this._element.value = value;
    }
    get value() {
        return this._element.value;
    }
    set disabled(disabled) {
        disabled
            ? this._element.classList.add("input-disabled")
            : this._element.classList.remove("input-disabled");
        this._element.disabled = disabled;
        this._options.disabled = disabled;
    }
    get disabled() {
        return this._options.disabled;
    }
    get id() {
        return this._options.id;
    }
    type(text) {
        if (this._options.disabled || !this._validate(this.value + text))
            return;
        this.value += text;
        this._onInput.fire(this.value);
        this._onDidChange.fire(this.value);
    }
    reset() {
        this.value = "";
    }
    get onInput() {
        return this._onInput.event;
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    dispose() {
        this.reset();
        super.dispose();
    }
}
exports.Input = Input;
