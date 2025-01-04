import type { HoverWidget, HoverWidgetPosition } from "@/ui/hoverWidget/hoverWidget";

import { Component, type ComponentLike } from "@/ui/ui";
import { Emitter, type Event } from "@/common/event";
import { hoverProvider } from "@/ui/hoverWidget/hoverProvider";

import "./toggle.less";

export interface ToggleOptions {
    disabled?: boolean
    defaultValue?: boolean
    tooltip?: string
    tooltipPosition?: HoverWidgetPosition
    id?: string
}

const defaultOptions: ToggleOptions = {
    disabled: false,
    tooltipPosition: "bottom-right"
};

export interface IToggle {
    isActive: boolean

    /**
     * Set the state of the toggle
     * 
     * @param isActive The new state
     */
    setActive(isActive: boolean): void
    /**
     * Set the button's tooltip
     * 
     * @param text The new tooltip text
     */
    setTooltip(text: string): void

    onDidChange: Event<boolean>
}

export class Toggle extends Component<HTMLDivElement, ToggleOptions> implements IToggle {
    // events
    private _onDidChange = new Emitter<boolean>();

    public isActive: boolean = false;
    private _tooltipWidget: HoverWidget | null = null;

    public constructor(target: ComponentLike, _options?: ToggleOptions) {
        super(
            (
                <div className="toggle">
                    <span className="toggle-bar"/>
                    <span className="toggle-knob"/>
                </div>
            ),
            target,
            defaultOptions,
            _options
        );

        if(this._options.disabled) this.disabled = this._options.disabled;
        if(this._options.defaultValue) this.setActive(true);
        if(this._options.id) this._element.id = this._options.id;

        this._register(this._onDidChange);
        
        this._element.addEventListener("click", () => {
            if(!this.disabled) this._toggle();
        });

        if(this._options.tooltip) {
            this._register(this.onHover(() => {
                const rect = this._element.getBoundingClientRect();

                this._tooltipWidget = hoverProvider.createTextHoverWidget(this._options.tooltip, {
                    x: rect.left,
                    y: rect.top + rect.height,
                }, this._options.tooltipPosition);
            }));
            this._register(this.onUnhover(() => {
                hoverProvider.clearHoverWidgets();
                this._tooltipWidget = null;
            }));
        }
    }

    private _toggle(): void {
        this.setActive(!this.isActive);

        this._onDidChange.fire(this.isActive);
    }

    public set disabled(disabled) {
        disabled
        ? this._element.classList.add("toggle-disabled")
        : this._element.classList.remove("toggle-disabled");

        this._options.disabled = disabled;
    }

    public get disabled() {
        return this._options.disabled;
    }

    public get id() {
        return this._options.id;
    }

    public setActive(isActive: boolean) {
        this.isActive = isActive;
        
        if(this.isActive) {
            this._element.classList.add("toggle-active");
        } else {
            this._element.classList.remove("toggle-active");
        }
    }

    public setTooltip(text: string) {
        this._options.tooltip = text;
        if(this._tooltipWidget) this._tooltipWidget.text = text;
    }

    public get onDidChange() {
        return this._onDidChange.event;
    }

    public override dispose() {
        super.dispose();

        hoverProvider.clearHoverWidgets();
        this._tooltipWidget = null;
    }
}
