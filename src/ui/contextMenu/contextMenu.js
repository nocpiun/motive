"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextMenu = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_1 = require("lucide");
const ui_1 = require("@/ui/ui");
const utils_1 = require("@/common/utils/utils");
const event_1 = require("@/common/event");
const contextMenuProvider_1 = require("./contextMenuProvider");
require("./contextMenu.less");
const defaultOptions = {
    anchor: {
        x: 0,
        y: 0
    },
    position: "bottom-right",
    noBackdrop: false,
    isSubMenu: false,
    items: []
};
class ContextMenu extends ui_1.Component {
    constructor(target, _options) {
        super(((0, jsx_runtime_1.jsx)("div", { className: "context-menu-backdrop", children: (0, jsx_runtime_1.jsx)("div", { className: "context-menu", "data-position": _options.position }) })), target, defaultOptions, _options);
        this.contextMenuElem = this._element.querySelector(".context-menu");
        if (this._options.id)
            this._element.id = this._options.id;
        if (this._options.noBackdrop)
            this._element.classList.add("hidden");
        for (const info of this._options.items) {
            if (info.hidden)
                continue;
            info.separator
                ? this._createSeparator()
                : this._createItem(info);
        }
        this.setPosition(this._options.position);
        // Remove the context menu when the user clicks outside
        this._element.addEventListener("mousedown", (e) => {
            if (e.target === this._element && !this._options.isSubMenu) {
                contextMenuProvider_1.contextMenuProvider.clearContextMenus();
            }
        });
        window.addEventListener("blur", () => contextMenuProvider_1.contextMenuProvider.clearContextMenus());
    }
    _createItem(info) {
        const item = new ContextMenuItem(this.contextMenuElem, Object.assign(Object.assign({}, info), { id: `${this._options.id}.${(0, utils_1.generateRandomID)()}`, parentMenu: this }));
        this._register(item);
        if (info.action) {
            this._register(item.onClick(() => info.action()));
        }
    }
    _createSeparator() {
        const item = new ContextMenuItem(this.contextMenuElem, {
            separator: true,
            id: `${this._options.id}.${(0, utils_1.generateRandomID)()}`,
            parentMenu: this
        });
        this._register(item);
    }
    setPosition(position) {
        this._options.position = position;
        const width = this.width;
        const height = this.height;
        switch (position) {
            case "top-left":
                this.contextMenuElem.style.left = (this._options.anchor.x - width) + "px";
                this.contextMenuElem.style.top = (this._options.anchor.y - height) + "px";
                break;
            case "top-right":
                this.contextMenuElem.style.left = this._options.anchor.x + "px";
                this.contextMenuElem.style.top = (this._options.anchor.y - height) + "px";
                break;
            case "bottom-left":
                this.contextMenuElem.style.left = (this._options.anchor.x - width) + "px";
                this.contextMenuElem.style.top = this._options.anchor.y + "px";
                break;
            case "bottom-right":
                this.contextMenuElem.style.left = this._options.anchor.x + "px";
                this.contextMenuElem.style.top = this._options.anchor.y + "px";
                break;
        }
    }
    get width() {
        return this.contextMenuElem.clientWidth;
    }
    get height() {
        return this.contextMenuElem.clientHeight;
    }
    get id() {
        return this._options.id;
    }
}
exports.ContextMenu = ContextMenu;
const itemDefaultOptions = {
    text: "",
    subItems: [],
    separator: false,
    parentMenu: null
};
class ContextMenuItem extends ui_1.Component {
    constructor(target, _options) {
        super(((0, jsx_runtime_1.jsx)("div", { className: "context-menu-item", children: !_options.separator && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "icon-wrapper", children: _options.icon && (0, lucide_1.createElement)(_options.icon) }), (0, jsx_runtime_1.jsx)("button", { children: _options.text }), (_options.subItems && _options.subItems.length > 0) && ((0, jsx_runtime_1.jsx)("div", { className: "icon-wrapper", children: (0, lucide_1.createElement)(lucide_1.ChevronRight) })), (0, jsx_runtime_1.jsx)("div", { className: "sub-context-menu-container" })] })) })), target, itemDefaultOptions, _options);
        // events
        this._onClick = new event_1.Emitter();
        this._subMenu = null;
        this._subMenuContainer = this._element.querySelector(".sub-context-menu-container");
        if (this._options.subItems && this._options.subItems.length > 0)
            this._subItems = this._options.subItems;
        if (this._options.separator)
            this._element.className = "separator";
        if (this._options.id)
            this._element.id = this._options.id;
        this._register(this._onClick);
        if (this._subItems) {
            this._register(this.onHover(() => this._createSubContextMenu()));
            this._register(this.onUnhover((e) => {
                const rect = this._element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                // Only when the mouse moves out from the right side of the menu,
                // do not close the sub context menu
                if (x <= rect.width)
                    this._closeSubContextMenu();
            }));
        }
        if (!this._options.separator && !this._subItems) {
            this._element.addEventListener("click", (e) => {
                e.stopPropagation();
                this._onClick.fire();
                contextMenuProvider_1.contextMenuProvider.clearContextMenus();
            });
        }
    }
    _createSubContextMenu() {
        if (this._subMenu)
            return;
        const parentRect = this._options.parentMenu.contextMenuElem.getBoundingClientRect();
        this._subMenu = new ContextMenu(this._subMenuContainer, {
            items: this._subItems,
            position: "bottom-right",
            anchor: {
                x: parentRect.width - this._element.offsetLeft,
                y: 0
            },
            isSubMenu: true
        });
    }
    _closeSubContextMenu() {
        if (!this._subMenu)
            return;
        this._subMenu.dispose();
        this._subMenu = null;
    }
    get id() {
        return this._options.id;
    }
    get onClick() {
        return this._onClick.event;
    }
}
