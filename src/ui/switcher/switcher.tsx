import { createElement as createLucide, type IconNode } from "lucide";

import { Component, ComponentLike, IComponent } from "@/ui/ui";
import { Button, ButtonOptions, IButton } from "@/ui/button/button";
import { Emitter, Event } from "@/common/event";

import "./switcher.less";

type SwitcherVariant = "primary" | "secondary";

export interface SwitcherOptions extends ButtonOptions {
    variant?: SwitcherVariant
}

const defaultOptions: SwitcherOptions = {
    variant: "secondary",
    disabled: false
};

interface ISwitcher extends IButton {
    isActive: boolean

    onDidChange: Event<boolean>
}

export class Switcher extends Button implements ISwitcher {
    private _onDidChange = new Emitter<boolean>();

    public isActive: boolean = false;

    public constructor(target: ComponentLike, _options?: SwitcherOptions) {
        super(target, _options);

        this._element.classList.add("switcher");

        this._register(this.onClick(() => this._toggle()));
    }

    private _toggle(): void {
        this.isActive = !this.isActive;

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
