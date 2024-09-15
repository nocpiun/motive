import { Component, ComponentLike, IComponent } from "@/ui/ui";
import { Emitter, Event, Listener } from "@/common/event";
import { Switcher, SwitcherOptions, type SwitcherEvent } from "@/ui/switcher/switcher";

import { Button, type ButtonOptions } from "./button";

import "./button.less";

interface ButtonGroupOptions {
    variant?: "primary" | "secondary" | "success" | "danger"
    width?: number
    height?: number
    disabled?: boolean
}

const defaultOptions: ButtonGroupOptions = {
    variant: "secondary",
    disabled: false
};

interface IButtonGroup extends IComponent {
    addButton(options: ButtonOptions, onClick?: Listener<PointerEvent>): Button
    addSwitcher(options: SwitcherOptions, onDidChange?: Listener<SwitcherEvent>): Switcher

    onDidChange: Event<Button>
}

export class ButtonGroup extends Component<HTMLDivElement, ButtonGroupOptions> implements IButtonGroup {
    // events
    private _onDidChange = new Emitter<Button>();

    public constructor(target: ComponentLike, _options?: ButtonGroupOptions) {
        super(
            <div class="button-group"/>,
            target,
            defaultOptions,
            _options
        );

        this._register(this._onDidChange);
    }

    public addButton(options: ButtonOptions, onClick?: Listener<PointerEvent>) {
        const button = new Button(this, options);
        button.element.classList.add("grouped");
        if(this._options.variant) button.variant = this._options.variant;
        if(this._options.disabled) button.disabled = true;

        if(onClick) button.onClick(onClick);

        this._register(button);
        this._onDidChange.fire(button);
        return button;
    }

    public addSwitcher(options: SwitcherOptions, onDidChange?: Listener<SwitcherEvent>) {
        const switcher = new Switcher(this, options);
        switcher.element.classList.add("grouped");
        if(this._options.variant) switcher.variant = this._options.variant;
        if(this._options.disabled) switcher.disabled = true;

        if(onDidChange) switcher.onDidChange(onDidChange);

        this._register(switcher);
        this._onDidChange.fire(switcher);
        return switcher;
    }

    public get onDidChange() {
        return this._onDidChange.event;
    }
}
