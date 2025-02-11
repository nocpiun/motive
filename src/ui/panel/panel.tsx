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
    Settings as SettingsIcon,
    Share,
} from "lucide";

import { Emitter, type Event } from "@/common/event";
import { Component, type ComponentLike, createElement, type IComponent } from "@/ui/ui";
import { ButtonGroup } from "@/ui/button/buttonGroup";
import { Switcher } from "@/ui/switcher/switcher";
import { modalProvider } from "@/ui/modal/modalProvider";
import { contextMenuProvider } from "@/ui/contextMenu/contextMenuProvider";
import { getVersionString } from "@/common/global";
import { Settings } from "@/common/settings";
import { $ } from "@/common/i18n";

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
    
    private _wallModeSwitcher: Switcher;
    private _refreshButton: Button;
    private _pauseSwitcher: Switcher;
    private _fpsLabel: HTMLSpanElement;
    private _switchers: Switcher[] = [];
    private _modalAutoPause: boolean = false;

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
        toolbarLeftGroup.addButton({ icon: SettingsIcon, tooltip: $("panel.tooltip.settings") }, () => modalProvider.open("settings"));
        toolbarLeftGroup.addButton({ icon: Box, tooltip: $("panel.tooltip.manager") }, () => modalProvider.open("manager", { objects: this._renderer.getObjects() }));
        toolbarLeftGroup.addSwitcher({ icon: MousePointer2, tooltip: $("panel.tooltip.mouse-mode") }, ({ isActive }) => this._renderer.setMouseMode(isActive));
        this._wallModeSwitcher = toolbarLeftGroup.addSwitcher({ icon: BrickWall, tooltip: $("panel.tooltip.wall"), defaultValue: Settings.get().getValue("wallMode") }, ({ isActive }) => Settings.get().setValue("wallMode", isActive));
        this._refreshButton = toolbarLeftGroup.addButton({ icon: RotateCw, tooltip: $("panel.tooltip.refresh") });
        this._pauseSwitcher = toolbarLeftGroup.addSwitcher({ icon: Pause, tooltip: $("panel.tooltip.pause") }, ({ isActive }) => {
            isActive ? this._pauseRenderer() : this._unpauseRenderer();
        });
        
        const rightSplit = createElement("div", toolbar);
        rightSplit.classList.add("panel-toolbar-right-split");
        this._fpsLabel = createElement("span", rightSplit);
        const versionLabel = createElement("span", rightSplit);
        versionLabel.textContent = getVersionString();
        const toolbarRightGroup = new ButtonGroup(rightSplit);
        toolbarRightGroup.addButton({ icon: Share, tooltip: $("panel.tooltip.export") }, () => {});
        toolbarRightGroup.addButton({ icon: FilePlus2, tooltip: $("panel.tooltip.import") }, () => modalProvider.open("import", { renderer: this._renderer }));
        toolbarRightGroup.addButton({ icon: Info, tooltip: $("panel.tooltip.about"), tooltipPosition: "top-left" }, () => modalProvider.open("about"));

        const switcherContainer = createElement("div", this);
        switcherContainer.classList.add("panel-switcher-container");

        // Context Menu
        
        contextMenuProvider.registerContextMenu(this, [
            {
                text: $("panel.ctx.refresh"),
                icon: RotateCw,
                action: () => {
                    if(this._renderer.isPaused) return;

                    this._renderer.refresh();
                }
            },
            { separator: true },
            {
                text: $("panel.ctx.settings"),
                icon: SettingsIcon,
                action: () => modalProvider.open("settings")
            },
            {
                text: $("panel.ctx.manager"),
                icon: Box,
                action: () => modalProvider.open("manager")
            },
            {
                text: $("panel.ctx.about"),
                icon: Info,
                action: () => modalProvider.open("about")
            }
        ]);

        this._register(Settings.get().onDidChange(({ key, value }) => {
            if(key === "wallMode") {
                this._wallModeSwitcher.setActive(value);
            }
        }));

        document.body.addEventListener("keydown", (e) => {
            if(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            const code = e.key.charCodeAt(0);

            if(code >= 48 && code <= 57) { // 0-9
                const index = parseInt(e.key, 10) - 1;

                if(index >= 0 && index < this._switchers.length) {
                    const switcher = this._switchers[index];
                    if(!switcher.disabled) switcher.select();
                }
            }
        });
    }

    private _pauseRenderer(): void {
        this._renderer.pause();
        this._pauseSwitcher.setIcon(Play);
        this._pauseSwitcher.setTooltip($("panel.tooltip.unpause"));
        this._refreshButton.disabled = true;
    }

    private _unpauseRenderer(): void {
        this._renderer.unpause();
        this._pauseSwitcher.setIcon(Pause);
        this._pauseSwitcher.setTooltip($("panel.tooltip.pause"));
        this._refreshButton.disabled = false;
    }

    public linkRenderer(renderer: Render) {
        this._renderer = renderer;
        this._register(this._renderer);

        this._register(this._renderer.onRender(({ fps }) => {
            if(!Settings.get().getValue("fps")) {
                this._fpsLabel.textContent = "";
                return;
            }

            this._fpsLabel.textContent = `FPS: ${fps.toFixed(2)}`;
        }));
        
        this._register(this._refreshButton.onClick(() => {
            this._renderer.refresh();
        }));

        this._register(modalProvider.onModalOpen(() => {
            if(!this._renderer.isPaused) {
                this._pauseRenderer();
                this._modalAutoPause = true;
            }
        }));
        this._register(modalProvider.onModalClose(() => {
            if(this._modalAutoPause) {
                this._unpauseRenderer();
                this._modalAutoPause = false;
            }
        }));

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
                    text: $("panel.button.ctx.select"),
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
