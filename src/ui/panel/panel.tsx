import { Component, ComponentLike, IComponent } from "@/ui/ui";

import "./panel.less";
import { ButtonGroup } from "../button/buttonGroup";
import { Box, Menu, RefreshCw, RotateCw, Settings } from "lucide";

export interface PanelOptions {
    width?: number
    height?: number
}

const defaultOptions: PanelOptions = {
    width: 630,
    height: 150
};

interface IPanel extends IComponent {
    
}

export class Panel extends Component<HTMLDivElement, PanelOptions> implements IPanel {
    public constructor(target: ComponentLike, _options?: PanelOptions) {
        super(
            <div className="panel"/>,
            target,
            defaultOptions,
            _options
        );

        if(this._options.width) this._element.style.width = `${this._options.width}px`;
        if(this._options.height) this._element.style.height = `${this._options.height}px`;

        const group = new ButtonGroup(this);
        group.addButton({ text: "Settings", icon: Settings });
        group.addButton({ icon: RotateCw });
        group.addButton({ icon: Box });
    }
}
