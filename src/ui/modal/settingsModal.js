"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModal = void 0;
const lucide_1 = require("lucide");
const modal_1 = require("./modal");
class SettingsModal extends modal_1.Modal {
    constructor(target) {
        super(target, { id: "settings", title: "设置" });
        this._addFooterButton("save", { text: "保存", variant: "success", icon: lucide_1.Check }, "right", () => this.close());
        this._addFooterButton("cancel", { text: "取消", variant: "secondary" }, "right", () => this.close());
    }
}
exports.SettingsModal = SettingsModal;
