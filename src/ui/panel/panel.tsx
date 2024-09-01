import { Box, Circle, Pin, RotateCw, Settings, Spline, X } from "lucide";

import { Component, ComponentLike, createElement, IComponent } from "@/ui/ui";
import { Button } from "@/ui/button/button";
import { ButtonGroup } from "@/ui/button/buttonGroup";
import { Switcher } from "@/ui/switcher/switcher";
import { Render } from "@/render/render";

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
    linkRenderer(renderer: Render): void
}

export class Panel extends Component<HTMLDivElement, PanelOptions> implements IPanel {
    private static readonly WITHDRAW_TIME = 1500; // ms
    private _renderer: Render | null = null;
    private _controller: AbortController | null = new AbortController();
    
    private _isPoppedUp: boolean = false;
    private _isPinned: boolean = false;
    private _withdrawTimer: NodeJS.Timeout | null = null;

    private _refreshButton: Button;
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
        toolbarLeftGroup.addButton({ icon: Settings }, () => {});
        toolbarLeftGroup.addButton({ icon: Box }, () => {});
        this._refreshButton = toolbarLeftGroup.addButton({ icon: RotateCw });
        
        const toolbarRightGroup = new ButtonGroup(toolbar);
        toolbarRightGroup.addSwitcher({ icon: Pin }, ({ isActive }) => {
            isActive ? this._pin() : this._unpin();
        });
        this._closeButton = toolbarRightGroup.addButton({ icon: X }, () => this._withdraw(false));

        const switcherContainer = createElement("div", this);
        switcherContainer.classList.add("panel-switcher-container");

        this._switchers.push(new Switcher(switcherContainer, { id: "objects.ball", text: "小球", icon: Circle, defaultValue: true }));
        this._switchers.push(new Switcher(switcherContainer, { id: "objects.board", text: "木板", icon: Box }));
        this._switchers.push(new Switcher(switcherContainer, { id: "objects.rope", text: "绳子", icon: Spline }));

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
        this._closeButton.disabled = true;
    }

    private _unpin(): void {
        if(!this._isPinned) return;

        this._isPinned = false;
        this._closeButton.disabled = false;
    }

    public linkRenderer(renderer: Render) {
        this._renderer = renderer;
        this._register(this._renderer);
        
        this._register(this._refreshButton.onClick(() => this._renderer.refresh()));

        for(let switcher of this._switchers) {
            this._register(
                switcher.onDidChange(({ id, isActive }) => {
                    if(!isActive) {
                        switcher.setActive(true);
                    }

                    for(let _switcher of this._switchers) {
                        if(_switcher.id !== id) {
                            _switcher.setActive(false);
                        }
                    }
                })
            );
        }
    }

    public override dispose(): void {
        this._controller.abort();
        this._controller = null;

        super.dispose();
    }
}
