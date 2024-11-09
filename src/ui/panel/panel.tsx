import type { Button } from "@/ui/button/button";
import type { Render } from "@/simulator/render/render";
import type { ObjectNameMap } from "@/simulator/object";

import {
    type IconNode,
    Box,
    BrickWall,
    FilePlus2,
    Info,
    MousePointer2,
    Pause,
    Play,
    RotateCw,
    Settings,
    Share,
} from "lucide";

import { Emitter, type Event } from "@/common/event";
import { Component, type ComponentLike, createElement, type IComponent } from "@/ui/ui";
import { ButtonGroup } from "@/ui/button/buttonGroup";
import { Switcher } from "@/ui/switcher/switcher";
import { modalProvider } from "@/ui/modal/modalProvider";
import { contextMenuProvider } from "@/ui/contextMenu/contextMenuProvider";
import { getVersionString } from "@/common/global";

import "./panel.less";

type AvailableObjectNames = Exclude<keyof ObjectNameMap, "ground">;

export interface PanelOptions {
    
}

const defaultOptions: PanelOptions = { };

interface IPanel extends IComponent {
    /**
     * Link a renderer to the panel,
     * so that the panel can add, remove and change objects in the system,
     * which will then be rendered into the canvas by the renderer linked.
     */
    linkRenderer(renderer: Render): void
    addObjectSwitcher(id: AvailableObjectNames, displayName: string, icon: IconNode, disabled?: boolean, defaultValue?: boolean): Switcher

    onSelectedObjectChange: Event<keyof ObjectNameMap>
}

export class Panel extends Component<HTMLDivElement, PanelOptions> implements IPanel {
    private _renderer: Render | null = null;

    // events
    private _onSelectedObjectChange = new Emitter<keyof ObjectNameMap>();
    
    private _refreshButton: Button;
    private _pauseSwitcher: Switcher;
    private _fpsLabel: HTMLSpanElement;
    private _switchers: Switcher[] = [];

    public constructor(target: ComponentLike, _options?: PanelOptions) {
        super(
            <div className="panel"/>,
            target,
            defaultOptions,
            _options
        );

        // UI

        const toolbar = createElement("div", this);
        toolbar.classList.add("panel-toolbar");

        const leftSplit = createElement("div", toolbar);
        leftSplit.classList.add("panel-toolbar-left-split");
        const toolbarLeftGroup = new ButtonGroup(leftSplit);
        toolbarLeftGroup.addButton({ icon: Settings, tooltip: "设置" }, () => modalProvider.open("settings"));
        toolbarLeftGroup.addButton({ icon: Box, tooltip: "管理" }, () => modalProvider.open("manager"));
        toolbarLeftGroup.addSwitcher({ icon: MousePointer2, tooltip: "鼠标模式" }, ({ isActive }) => this._renderer.setMouseMode(isActive));
        toolbarLeftGroup.addSwitcher({ icon: BrickWall, tooltip: "边界墙", defaultValue: true }, ({ isActive }) => this._renderer.setWallMode(isActive));
        this._refreshButton = toolbarLeftGroup.addButton({ icon: RotateCw, tooltip: "刷新" });
        this._pauseSwitcher = toolbarLeftGroup.addSwitcher({ icon: Pause, tooltip: "暂停" }, ({ isActive }) => {
            isActive ? this._pauseRenderer() : this._unpauseRenderer();
        });
        
        const rightSplit = createElement("div", toolbar);
        rightSplit.classList.add("panel-toolbar-right-split");
        this._fpsLabel = createElement("span", rightSplit);
        const versionLabel = createElement("span", rightSplit);
        versionLabel.textContent = getVersionString();
        const toolbarRightGroup = new ButtonGroup(rightSplit);
        toolbarRightGroup.addButton({ icon: Share, tooltip: "导出" }, () => {});
        toolbarRightGroup.addButton({ icon: FilePlus2, tooltip: "导入" }, () => modalProvider.open("import"));
        toolbarRightGroup.addButton({ icon: Info, tooltip: "关于", tooltipPosition: "top-left" }, () => modalProvider.open("about"));

        const switcherContainer = createElement("div", this);
        switcherContainer.classList.add("panel-switcher-container");

        // Context Menu
        
        contextMenuProvider.registerContextMenu(this, [
            {
                text: "刷新画面",
                icon: RotateCw,
                action: () => {
                    if(this._renderer.isPaused) return;

                    this._renderer.refresh();
                }
            },
            { separator: true },
            {
                text: "设置",
                icon: Settings,
                action: () => modalProvider.open("settings")
            },
            {
                text: "管理",
                icon: Box,
                action: () => modalProvider.open("manager")
            },
            {
                text: "关于 Motive",
                icon: Info,
                action: () => modalProvider.open("about")
            }
        ]);
    }

    private _pauseRenderer(): void {
        this._renderer.pause();
        this._pauseSwitcher.setIcon(Play);
        this._pauseSwitcher.setTooltip("继续");
        this._refreshButton.disabled = true;
    }

    private _unpauseRenderer(): void {
        this._renderer.unpause();
        this._pauseSwitcher.setIcon(Pause);
        this._pauseSwitcher.setTooltip("暂停");
        this._refreshButton.disabled = false;
    }

    public linkRenderer(renderer: Render) {
        this._renderer = renderer;
        this._register(this._renderer);

        this._register(this._renderer.onRender(({ fps }) => {
            this._fpsLabel.textContent = `FPS: ${fps.toFixed(2)}`;
        }));
        
        this._register(this._refreshButton.onClick(() => {
            this._renderer.refresh();
        }));

        this._register(modalProvider.onModalOpen(() => this._pauseRenderer()));
        this._register(modalProvider.onModalClose(() => this._unpauseRenderer()));

        for(const switcher of this._switchers) {
            this._register(
                switcher.onDidChange(({ id, isActive }) => {
                    this._onSelectedObjectChange.fire(id.replace("btn.obj.", "") as keyof ObjectNameMap);
                    
                    if(!isActive) {
                        switcher.setActive(true);
                    }

                    for(const _switcher of this._switchers) {
                        if(_switcher.id !== id) {
                            _switcher.setActive(false);
                        }
                    }
                })
            );
        }
    }

    public addObjectSwitcher(id: AvailableObjectNames, displayName: string, icon: IconNode, disabled = false, defaultValue = false) {
        const switcherContainer = document.querySelector(".panel-switcher-container");
        const switcher = new Switcher(switcherContainer, {
            id: "btn.obj."+ id,
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

    public get onSelectedObjectChange() {
        return this._onSelectedObjectChange.event;
    }
}
