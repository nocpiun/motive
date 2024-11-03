"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_1 = require("lucide");
const event_1 = require("@/common/event");
const input_1 = require("@/ui/input/input");
const modal_1 = require("./modal");
class ObjectModal extends modal_1.Modal {
    constructor(target) {
        super(target, { id: "object-settings", title: "" });
        // events
        this._onSave = new event_1.Emitter();
        this._data = null;
        this._addFooterButton("save", { text: "保存", variant: "success", icon: lucide_1.Check }, "right", () => this._save());
        this._addFooterButton("cancel", { text: "取消", variant: "secondary" }, "right", () => this.close());
        this._addFooterButton("delete", { text: "删除物体", variant: "danger" }, "left", () => this._deleteObject());
        // UI
        this._listElem = this._container.appendChild((0, jsx_runtime_1.jsx)("div", { className: "settings-list" }));
        this._register(this._onSave);
        this._register(this.onShow((data) => {
            this._data = data;
            this._setTitle(data.id);
            for (const [key, item] of Object.entries(data.items)) {
                this._addItem(key, item);
            }
        }));
        this._register(this.onClose(() => {
            this._data = null;
            this._clearItems();
        }));
    }
    _addItem(key, item) {
        var _a;
        const type = (_a = item.type) !== null && _a !== void 0 ? _a : "input";
        const itemElem = ((0, jsx_runtime_1.jsxs)("div", { className: "settings-list-item", children: [(0, jsx_runtime_1.jsx)("span", { children: item.name }), (0, jsx_runtime_1.jsx)("div", { className: "settings-list-item-control" })] }));
        switch (type) {
            case "input": {
                const input = new input_1.Input(itemElem.querySelector(".settings-list-item-control"), Object.assign({ defaultValue: typeof item.value === "number" ? item.value.toString() : item.value }, item.controlOptions));
                input.onInput((newValue) => {
                    this._data.items[key].value = newValue;
                });
                break;
            }
            case "switcher": {
                /** @todo */
                break;
            }
        }
        this._listElem.appendChild(itemElem);
    }
    _clearItems() {
        this._listElem.innerHTML = "";
    }
    _save() {
        this._onSave.fire({
            obj: this._data.obj,
            items: this._data.items
        });
        this.close();
    }
    _deleteObject() {
        const obj = this._data.obj;
        obj.render.deleteObject(obj);
        this.close();
    }
    get onSave() {
        return this._onSave.event;
    }
}
exports.ObjectModal = ObjectModal;
