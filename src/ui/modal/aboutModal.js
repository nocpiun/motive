"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_1 = require("lucide");
const global_1 = require("@/common/global");
const modal_1 = require("./modal");
class AboutModal extends modal_1.Modal {
    constructor(target) {
        super(target, { id: "about", title: "关于" });
        this._addFooterButton("donate", {
            text: "打赏",
            variant: "primary",
            icon: lucide_1.HandCoins,
            contextMenuItems: [
                {
                    text: "打赏",
                    icon: lucide_1.HandCoins,
                    action: () => window.open("https://github.com/sponsors/nocpiun", "_blank")
                },
                { separator: true },
                {
                    text: "链接",
                    subItems: [
                        {
                            text: "项目 Github 仓库",
                            icon: lucide_1.SquareArrowOutUpRight,
                            action: () => window.open("https://github.com/nocpiun/motive", "_blank")
                        },
                        {
                            text: "作者 Github 主页",
                            icon: lucide_1.SquareArrowOutUpRight,
                            action: () => window.open("https://github.com/NriotHrreion", "_blank")
                        },
                        {
                            text: "作者个人网站",
                            icon: lucide_1.SquareArrowOutUpRight,
                            action: () => window.open("https://nocp.space", "_blank")
                        }
                    ]
                }
            ]
        }, "left", () => {
            window.open("https://nocp.space/donate", "_blank");
        });
        this._addFooterButton("changelog", { text: "更新日志", variant: "secondary", icon: lucide_1.BookMarked });
        // UI
        this._container.appendChild((0, jsx_runtime_1.jsxs)("div", { className: "basic-info-container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "title-container", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Motive" }), (0, jsx_runtime_1.jsxs)("span", { className: "version-number", children: ["v", global_1.version] })] }), (0, jsx_runtime_1.jsx)("div", { className: "copyright-container", children: (0, jsx_runtime_1.jsxs)("span", { children: ["By Nocpiun Org / Copyright (c) ", new Date().getFullYear(), " NriotHrreion"] }) })] }));
        this._container.appendChild((0, jsx_runtime_1.jsx)("div", { className: "info-list-container" }));
        this._addInfoListItem("版本", (0, global_1.getVersionString)());
        this._addInfoListItem("Github 仓库", "nocpiun/motive", "https://github.com/nocpiun/motive");
        this._addInfoListItem("许可", "MPL-2.0 License");
    }
    _addInfoListItem(name, content, link) {
        var _a;
        (_a = this._container.querySelector(".info-list-container")) === null || _a === void 0 ? void 0 : _a.appendChild((0, jsx_runtime_1.jsxs)("div", { className: "info-list-item", children: [(0, jsx_runtime_1.jsx)("span", { className: "info-list-item-name", children: name }), link
                    ? (0, jsx_runtime_1.jsx)("a", { className: "info-list-item-content", href: link, target: "_blank", rel: "noreferrer", children: content })
                    : (0, jsx_runtime_1.jsx)("span", { className: "info-list-item-content", children: content })] }));
    }
}
exports.AboutModal = AboutModal;
