import type { Button } from "@/ui/button/button";
import type { Render } from "@/simulator/render/render";
import type { ObjectNameMap } from "@/simulator/object";

import {
    Box,
    Circle,
    Cuboid,
    Info,
    MousePointer2,
    Pause,
    Pin,
    Play,
    RotateCw,
    Settings,
    Spline,
    X
} from "lucide";

import { Emitter, type Event } from "@/common/event";
import { Component, type ComponentLike, createElement, type IComponent } from "@/ui/ui";
import { ButtonGroup } from "@/ui/button/buttonGroup";
import { Switcher } from "@/ui/switcher/switcher";
import { modalProvider } from "@/ui/modal/modalProvider";

import "./panel.less";

export interface PanelOptions {
    width?: number
    height?: number
}

const defaultOptions: PanelOptions = {
    width: 630,
    height: 150
};

interface IPanel extends IComponent {
    /**
     * Link a renderer to the panel,
     * so that the panel can add, remove and change objects in the system,
     * which will then be rendered into the canvas by the renderer linked.
     */
    linkRenderer(renderer: Render): void

    onSelectedObjectChange: Event<keyof ObjectNameMap>
}

export class Panel extends Component<HTMLDivElement, PanelOptions> implements IPanel {
    private static readonly WITHDRAW_TIME = 1500; // ms
    private _renderer: Render | null = null;
    private _controller: AbortController | null = new AbortController();

    // events
    private _onSelectedObjectChange = new Emitter<keyof ObjectNameMap>();
    
    private _isPoppedUp: boolean = false;
    private _isPinned: boolean = false;
    private _withdrawTimer: NodeJS.Timeout | null = null;

    private _refreshButton: Button;
    private _pauseSwitcher: Switcher;
    private _pinSwitcher: Switcher;
    private _closeButton: Button;
    private _switchers: Switcher[] = [];

    public constructor(target: ComponentLike, _options?: PanelOptions) {
        super(
            <div className="panel"/>,
            target,
            defaultOptions,
            _options
        );

        if(this._options.width) this._element.style.width = `${this._options.width}px`;
        if(this._options.height) this._element.style.height = `${this._options.height}px`;

        // UI

        const toolbar = createElement("div", this);
        toolbar.classList.add("panel-toolbar");

        const toolbarLeftGroup = new ButtonGroup(toolbar);
        toolbarLeftGroup.addButton({ icon: Settings, tooltip: "设置" }, () => modalProvider.open("settings"));
        toolbarLeftGroup.addButton({ icon: Box, tooltip: "管理" }, () => modalProvider.open("manager"));
        toolbarLeftGroup.addSwitcher({ icon: MousePointer2, tooltip: "鼠标模式" }, () => {});
        this._refreshButton = toolbarLeftGroup.addButton({ icon: RotateCw, tooltip: "刷新" });
        this._pauseSwitcher = toolbarLeftGroup.addSwitcher({ icon: Pause, tooltip: "暂停" }, ({ isActive }) => {
            isActive ? this._pauseRenderer() : this._unpauseRenderer();
        });
        
        const toolbarRightGroup = new ButtonGroup(toolbar);
        toolbarRightGroup.addButton({ icon: Info, tooltip: "关于" }, () => modalProvider.open("about"));
        this._pinSwitcher = toolbarRightGroup.addSwitcher({ icon: Pin, tooltip: "固定" }, ({ isActive }) => {
            isActive ? this._pin() : this._unpin();
        });
        this._closeButton = toolbarRightGroup.addButton({ icon: X }, () => this._withdraw(false));

        const switcherContainer = createElement("div", this);
        switcherContainer.classList.add("panel-switcher-container");

        this._switchers.push(new Switcher(switcherContainer, { id: "btn.obj.ball", text: "小球", icon: Circle, defaultValue: true }));
        this._switchers.push(new Switcher(switcherContainer, { id: "btn.obj.block", text: "木块", icon: Box }));
        this._switchers.push(new Switcher(switcherContainer, { id: "btn.obj.board", text: "木板", icon: Cuboid, disabled: true }));
        this._switchers.push(new Switcher(switcherContainer, { id: "btn.obj.rope", text: "绳子", icon: Spline, disabled: true }));

        // Listeners

        this._element.addEventListener("mouseenter", () => this._popUp(), { signal: this._controller.signal });
        this._element.addEventListener("mouseleave", () => this._withdraw(), { signal: this._controller.signal });
    }

    private _popUp(): void {
        if(this._withdrawTimer) {
            clearTimeout(this._withdrawTimer);
            this._withdrawTimer = null;
        }
        if(this._isPoppedUp) return;
        
        this._isPoppedUp = true;
        this._element.classList.add("panel-popped-up");
    }

    private _withdraw(shouldTimerSet: boolean = true): void {
        if(!this._isPoppedUp || this._isPinned) return;

        if(shouldTimerSet) {
            this._withdrawTimer = setTimeout(() => {
                this._isPoppedUp = false;
                this._element.classList.remove("panel-popped-up");
            }, Panel.WITHDRAW_TIME);
        } else {
            this._isPoppedUp = false;
            this._element.classList.remove("panel-popped-up");
        }
    }

    private _pin(): void {
        if(this._isPinned) return;

        this._isPinned = true;
        this._popUp();
        this._pinSwitcher.setTooltip("取消固定");
        this._closeButton.disabled = true;
    }

    private _unpin(): void {
        if(!this._isPinned) return;

        this._isPinned = false;
        this._pinSwitcher.setTooltip("固定");
        this._closeButton.disabled = false;
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
        
        this._register(this._refreshButton.onClick(() => {
            this._renderer.refresh();
            this._withdraw(false);
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

    public get onSelectedObjectChange() {
        return this._onSelectedObjectChange.event;
    }

    public override dispose(): void {
        this._controller.abort();
        this._controller = null;

        super.dispose();
    }
}
