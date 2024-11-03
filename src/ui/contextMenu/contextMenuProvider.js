"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextMenuProvider = void 0;
const provider_1 = require("@/ui/provider");
const utils_1 = require("@/common/utils/utils");
const ui_1 = require("@/ui/ui");
const contextMenu_1 = require("./contextMenu");
class ContextMenuProvider extends provider_1.Provider {
    constructor() {
        super("context-menu-provider");
    }
    createContextMenu(items, anchor, position) {
        const id = `context-menu.${(0, utils_1.generateRandomID)()}`;
        const menu = new contextMenu_1.ContextMenu(this._providerElement, { items, anchor, position, id });
        this._registerComponent(id, menu);
        return menu;
    }
    registerContextMenu(target, items) {
        if (items.length === 0)
            throw new Error("The context menu must have at least one item.");
        (target instanceof ui_1.Component ? target.element : target).addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.clearContextMenus();
            // default: "top-right"
            let a = "top";
            let b = "right";
            const menu = this.createContextMenu(items, {
                x: e.clientX,
                y: e.clientY
            }, `${a}-${b}`);
            const { width, height } = menu;
            if (e.clientX + width > window.innerWidth) {
                b = "left";
            }
            if (e.clientY - height < 0) {
                a = "bottom";
            }
            menu.setPosition(`${a}-${b}`);
        });
    }
    clearContextMenus() {
        this._clearComponents();
    }
}
exports.contextMenuProvider = (0, provider_1.registerProvider)(ContextMenuProvider);
