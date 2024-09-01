import { Box, Menu, RefreshCw, RotateCw, Settings } from "lucide";

import { Component, ComponentLike, createElement, IComponent } from "@/ui/ui";
import { Button } from "@/ui/button/button";
import { ButtonGroup } from "@/ui/button/buttonGroup";
import { Switcher } from "@/ui/switcher/switcher";

import "./panel.less";
import { Render } from "@/render/render";

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

        this._refreshButton = new Button(toolbar, { icon: RotateCw });

        new Switcher(this, { text: "TestObj", icon: Box });
    }

    public linkRenderer(renderer: Render) {
        this._renderer = renderer;
        this._register(this._renderer);
        
        this._register(this._refreshButton.onClick(() => this._renderer.refresh()));
    }
}
