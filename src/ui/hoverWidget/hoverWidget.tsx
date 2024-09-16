import type { Anchor } from "./hoverProvider";

import { Component, type ComponentLike, type IComponent } from "@/ui/ui";

import "./hoverWidget.less";

export type HoverWidgetPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface HoverWidgetOptions {
    id?: string
    title?: string
    text: string
    anchor: Anchor
    position: HoverWidgetPosition
}

const defaultOptions: HoverWidgetOptions = {
    text: "",
    anchor: {
        x: 0,
        y: 0
    },
    position: "bottom-right"
};

export interface IHoverWidget extends IComponent {
    title?: string
    text: string
    id?: string
}

export class HoverWidget extends Component<HTMLDivElement, HoverWidgetOptions> implements IHoverWidget {
    
    public constructor(target: ComponentLike, _options?: HoverWidgetOptions) {
        super(
            (
                <div className="hover-widget" data-position={_options.position}>
                    {_options.title && <h1 id="hover-widget-title">{_options.title}</h1>}
                    <span id="hover-widget-content">{_options.text}</span>
                </div>
            ),
            target,
            defaultOptions,
            _options
        );

        if(this._options.id) this._element.id = this._options.id;

        const width = this._element.clientWidth;
        const height = this._element.clientHeight;

        switch(this._options.position) {
            case "top-left":
                this._element.style.left = (this._options.anchor.x - width) +"px";
                this._element.style.top = (this._options.anchor.y - height) +"px";
                break;
            case "top-right":
                this._element.style.left = this._options.anchor.x +"px";
                this._element.style.top = (this._options.anchor.y - height) +"px";
                break;
            case "bottom-left":
                this._element.style.left = (this._options.anchor.x - width) +"px";
                this._element.style.top = this._options.anchor.y +"px";
                break;
            case "bottom-right":
                this._element.style.left = this._options.anchor.x +"px";
                this._element.style.top = this._options.anchor.y +"px";
                break;
        }

        // Appearing animation
        this._element.style.opacity = "1";
    }

    public set title(title: string) {
        this._options.title = title;
        this._element.querySelector("#hover-widget-title")!.textContent = title;
    }

    public get title(): string {
        return this._options.title;
    }

    public set text(text: string) {
        this._options.text = text;
        this._element.querySelector("#hover-widget-content")!.textContent = text;
    }

    public get text(): string {
        return this._options.text;
    }

    public get id() {
        return this._options.id;
    }
}
