import type { ComponentLike } from "@/ui/ui";

import { Button, type ButtonOptions, type IButton } from "@/ui/button/button";
import { Emitter, type Event } from "@/common/event";

import "./switcher.less";

type SwitcherVariant = "primary" | "secondary";

export interface SwitcherOptions extends ButtonOptions {
    variant?: SwitcherVariant
    defaultValue?: boolean
}

export interface SwitcherEvent {
    id?: string
    isActive: boolean
}

interface ISwitcher extends IButton {
    isActive: boolean

    setActive(isActive: boolean): void
    onDidChange: Event<SwitcherEvent>
}


export class Switcher extends Button implements ISwitcher {
    // events
    private _onDidChange = new Emitter<SwitcherEvent>();

    public isActive: boolean = false;

    public constructor(target: ComponentLike, _options?: SwitcherOptions) {
        super(target, _options);

        this._element.classList.add("switcher");
        if((this._options as SwitcherOptions).defaultValue) this.setActive(true);

        this._register(this.onClick(() => this._toggle()));
    }

    private _toggle(): void {
        this.setActive(!this.isActive);

        this._onDidChange.fire({
            id: this._options.id,
            isActive: this.isActive
        });
    }

    public setActive(isActive: boolean) {
        this.isActive = isActive;
        
        if(this.isActive) {
            this._element.classList.add("switcher-active");
        } else {
            this._element.classList.remove("switcher-active");
        }
    }

    public get onDidChange() {
        return this._onDidChange.event;
    }
}
