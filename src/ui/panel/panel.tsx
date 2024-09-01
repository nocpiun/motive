import { Box, Circle, RotateCw, Settings, Spline } from "lucide";

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
    private _renderer: Render | null = null;

    private _refreshButton: Button;

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

        const toolbar = createElement("div", this);
        toolbar.classList.add("panel-toolbar");

        const toolbarLeftGroup = new ButtonGroup(toolbar);
        toolbarLeftGroup.addButton({ icon: Settings });
        toolbarLeftGroup.addButton({ icon: Box });

        const toolbarRightGroup = new ButtonGroup(toolbar);
        this._refreshButton = toolbarRightGroup.addButton({ icon: RotateCw });

        const switcherContainer = createElement("div", this);
        switcherContainer.classList.add("panel-switcher-container");

        this._switchers.push(new Switcher(switcherContainer, { id: "ball", text: "小球", icon: Circle, defaultValue: true }));
        this._switchers.push(new Switcher(switcherContainer, { id: "board", text: "木板", icon: Box }));
        this._switchers.push(new Switcher(switcherContainer, { id: "rope", text: "绳子", icon: Spline }));
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
}
