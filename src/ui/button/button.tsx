import type { HoverWidget } from "@/ui/hoverWidget/hoverWidget";
import type { ContextMenuItemInfo } from "@/ui/contextMenu/contextMenu";

import { createElement as createLucide, type IconNode } from "lucide";

import { Emitter, type Event } from "@/common/event";
import { Component, type ComponentLike, type IComponent } from "@/ui/ui";
import { hoverProvider } from "@/ui/hoverWidget/hoverProvider";

import "./button.less";
import { contextMenuProvider } from "../contextMenu/contextMenuProvider";

type ButtonVariant = "primary" | "secondary" | "success" | "danger";

export interface ButtonOptions {
    text?: string
    variant?: ButtonVariant
    width?: number
    height?: number
    disabled?: boolean
    icon?: IconNode
    tooltip?: string
    contextMenuItems?: ContextMenuItemInfo[]
    id?: string
}

const defaultOptions: ButtonOptions = {
    variant: "secondary",
    disabled: false,
    contextMenuItems: []
};

export interface IButton extends IComponent {
    variant: ButtonVariant
    disabled: boolean
    id?: string

    setIcon(icon: IconNode): void
    /**
     * Set the button's tooltip
     * 
     * @param text The new tooltip text
     */
    setTooltip(text: string): void

    onClick: Event<PointerEvent>
}

export class Button extends Component<HTMLButtonElement, ButtonOptions> implements IButton {
    // events
    private _onClick = new Emitter<PointerEvent>();

    private _tooltipWidget: HoverWidget | null = null;

    public constructor(target: ComponentLike, _options?: ButtonOptions) {
        super(
            (
                <button
                    className="button"
                    onClick={(e: PointerEvent) => {
                        this._onClick.fire(e);
                    }}>
                    {
                        _options.icon
                        && (
                            <div className="icon-wrapper">
                                {_options.icon && createLucide(_options.icon)}
                            </div>
                        )
                    }
                    {_options.text && <span>{_options.text}</span>}
                </button>
            ),
            target,
            defaultOptions,
            _options
        );

        this._element.classList.add(`button-${this._options.variant}`);
        if(!this._options.text) this._element.classList.add("button-icon-only");
        if(this._options.disabled) this.disabled = this._options.disabled;
        if(this._options.width) this._element.style.width = `${this._options.width}px`;
        if(this._options.height) this._element.style.height = `${this._options.height}px`;
        if(this._options.id) this._element.id = this._options.id;

        if(this._options.contextMenuItems && this._options.contextMenuItems.length > 0) {
            contextMenuProvider.registerContextMenu(this, this._options.contextMenuItems);
        }

        this._register(this._onClick);
        if(this._options.tooltip) {
            this._register(this.onHover(() => {
                const rect = this._element.getBoundingClientRect();

                this._tooltipWidget = hoverProvider.createTextHoverWidget(this._options.tooltip, {
                    x: rect.left,
                    y: rect.top,
                }, "top-right");
            }));
            this._register(this.onUnhover(() => {
                hoverProvider.clearHoverWidgets();
                this._tooltipWidget = null;
            }));
        }
    }

    public set variant(variant) {
        this._element.classList.remove(`button-${this._options.variant}`)
        this._element.classList.add(`button-${variant}`);
        this._options.variant = variant;
    }

    public get variant() {
        return this._options.variant;
    }

    public set disabled(disabled) {
        disabled
        ? this._element.classList.add("button-disabled")
        : this._element.classList.remove("button-disabled");

        this._element.disabled = disabled;
        this._options.disabled = disabled;
    }

    public get disabled() {
        return this._options.disabled;
    }

    public get id() {
        return this._options.id;
    }

    public setIcon(icon: IconNode) {
        this._element.querySelector(".icon-wrapper")!.replaceChildren(createLucide(icon));
    }

    public setTooltip(text: string) {
        this._options.tooltip = text;
        if(this._tooltipWidget) this._tooltipWidget.text = text;
    }

    public get onClick() {
        return this._onClick.event;
    }

    public override dispose() {
        super.dispose();

        hoverProvider.clearHoverWidgets();
        this._tooltipWidget = null;
    }
}
