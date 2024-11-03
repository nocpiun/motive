"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Panel = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_1 = require("lucide");
const event_1 = require("@/common/event");
const ui_1 = require("@/ui/ui");
const buttonGroup_1 = require("@/ui/button/buttonGroup");
const switcher_1 = require("@/ui/switcher/switcher");
const modalProvider_1 = require("@/ui/modal/modalProvider");
const contextMenuProvider_1 = require("@/ui/contextMenu/contextMenuProvider");
const global_1 = require("@/common/global");
require("./panel.less");
const defaultOptions = {};
class Panel extends ui_1.Component {
    constructor(target, _options) {
        super((0, jsx_runtime_1.jsx)("div", { className: "panel" }), target, defaultOptions, _options);
        this._renderer = null;
        // events
        this._onSelectedObjectChange = new event_1.Emitter();
        this._switchers = [];
        // UI
        const toolbar = (0, ui_1.createElement)("div", this);
        toolbar.classList.add("panel-toolbar");
        const leftSplit = (0, ui_1.createElement)("div", toolbar);
        leftSplit.classList.add("panel-toolbar-left-split");
        const toolbarLeftGroup = new buttonGroup_1.ButtonGroup(leftSplit);
        toolbarLeftGroup.addButton({ icon: lucide_1.Settings, tooltip: "设置" }, () => modalProvider_1.modalProvider.open("settings"));
        toolbarLeftGroup.addButton({ icon: lucide_1.Box, tooltip: "管理" }, () => modalProvider_1.modalProvider.open("manager"));
        toolbarLeftGroup.addSwitcher({ icon: lucide_1.MousePointer2, tooltip: "鼠标模式" }, ({ isActive }) => this._renderer.setMouseMode(isActive));
        toolbarLeftGroup.addSwitcher({ icon: lucide_1.BrickWall, tooltip: "边界墙", defaultValue: true }, ({ isActive }) => this._renderer.setWallMode(isActive));
        this._refreshButton = toolbarLeftGroup.addButton({ icon: lucide_1.RotateCw, tooltip: "刷新" });
        this._pauseSwitcher = toolbarLeftGroup.addSwitcher({ icon: lucide_1.Pause, tooltip: "暂停" }, ({ isActive }) => {
            isActive ? this._pauseRenderer() : this._unpauseRenderer();
        });
        const rightSplit = (0, ui_1.createElement)("div", toolbar);
        rightSplit.classList.add("panel-toolbar-right-split");
        this._fpsLabel = (0, ui_1.createElement)("span", rightSplit);
        const versionLabel = (0, ui_1.createElement)("span", rightSplit);
        versionLabel.textContent = (0, global_1.getVersionString)();
        const toolbarRightGroup = new buttonGroup_1.ButtonGroup(rightSplit);
        toolbarRightGroup.addButton({ icon: lucide_1.Info, tooltip: "关于", tooltipPosition: "top-left" }, () => modalProvider_1.modalProvider.open("about"));
        const switcherContainer = (0, ui_1.createElement)("div", this);
        switcherContainer.classList.add("panel-switcher-container");
        // Context Menu
        contextMenuProvider_1.contextMenuProvider.registerContextMenu(this, [
            {
                text: "刷新画面",
                icon: lucide_1.RotateCw,
                action: () => {
                    if (this._renderer.isPaused)
                        return;
                    this._renderer.refresh();
                }
            },
            { separator: true },
            {
                text: "设置",
                icon: lucide_1.Settings,
                action: () => modalProvider_1.modalProvider.open("settings")
            },
            {
                text: "管理",
                icon: lucide_1.Box,
                action: () => modalProvider_1.modalProvider.open("manager")
            },
            {
                text: "关于 Motive",
                icon: lucide_1.Info,
                action: () => modalProvider_1.modalProvider.open("about")
            }
        ]);
    }
    _pauseRenderer() {
        this._renderer.pause();
        this._pauseSwitcher.setIcon(lucide_1.Play);
        this._pauseSwitcher.setTooltip("继续");
        this._refreshButton.disabled = true;
    }
    _unpauseRenderer() {
        this._renderer.unpause();
        this._pauseSwitcher.setIcon(lucide_1.Pause);
        this._pauseSwitcher.setTooltip("暂停");
        this._refreshButton.disabled = false;
    }
    linkRenderer(renderer) {
        this._renderer = renderer;
        this._register(this._renderer);
        this._register(this._renderer.onRender(({ fps }) => {
            this._fpsLabel.textContent = `FPS: ${fps.toFixed(2)}`;
        }));
        this._register(this._refreshButton.onClick(() => {
            this._renderer.refresh();
        }));
        this._register(modalProvider_1.modalProvider.onModalOpen(() => this._pauseRenderer()));
        this._register(modalProvider_1.modalProvider.onModalClose(() => this._unpauseRenderer()));
        for (const switcher of this._switchers) {
            this._register(switcher.onDidChange(({ id, isActive }) => {
                this._onSelectedObjectChange.fire(id.replace("btn.obj.", ""));
                if (!isActive) {
                    switcher.setActive(true);
                }
                for (const _switcher of this._switchers) {
                    if (_switcher.id !== id) {
                        _switcher.setActive(false);
                    }
                }
            }));
        }
    }
    addObjectSwitcher(id, displayName, icon, disabled = false, defaultValue = false) {
        const switcherContainer = document.querySelector(".panel-switcher-container");
        const switcher = new switcher_1.Switcher(switcherContainer, {
            id: "btn.obj." + id,
            text: displayName,
            icon,
            disabled,
            defaultValue,
            contextMenuItems: [
                {
                    text: "选择",
                    action: () => switcher.select()
                }
            ]
        });
        this._switchers.push(switcher);
        return switcher;
    }
    get onSelectedObjectChange() {
        return this._onSelectedObjectChange.event;
    }
}
exports.Panel = Panel;
