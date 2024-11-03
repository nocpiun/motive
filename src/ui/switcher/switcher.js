"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switcher = void 0;
const button_1 = require("@/ui/button/button");
const event_1 = require("@/common/event");
require("./switcher.less");
class Switcher extends button_1.Button {
    constructor(target, _options) {
        super(target, _options);
        // events
        this._onDidChange = new event_1.Emitter();
        this.isActive = false;
        this._element.classList.add("switcher");
        if (this._options.defaultValue)
            this.setActive(true);
        this._register(this._onDidChange);
        this._register(this.onClick(() => this._toggle()));
    }
    _toggle() {
        this.setActive(!this.isActive);
        this._onDidChange.fire({
            id: this._options.id,
            isActive: this.isActive
        });
    }
    select() {
        if (this.isActive)
            return;
        this.setActive(true);
        this._onDidChange.fire({
            id: this._options.id,
            isActive: true
        });
    }
    setActive(isActive) {
        this.isActive = isActive;
        if (this.isActive) {
            this._element.classList.add("switcher-active");
        }
        else {
            this._element.classList.remove("switcher-active");
        }
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
}
exports.Switcher = Switcher;
