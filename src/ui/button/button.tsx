import { Disposable } from "@/common/lifecycle";
import { Component, IComponent } from "@/ui/ui";
import { Emitter, Event } from "@/common/event";

import "./button.less";

interface ButtonOptions {
    width?: number
    height?: number
    variant: "primary" | "secondary" | "success" | "danger"
    disabled?: boolean
}

const defaultOptions: ButtonOptions = {
    width: -1,
    height: -1,
    variant: "primary",
    disabled: false
};

interface IButton extends IComponent {
    text: string

    onClick: Event<PointerEvent>
}

export class Button extends Component<HTMLButtonElement, ButtonOptions> implements IButton {
    // events
    private _onClick = new Emitter<PointerEvent>();

    public constructor(public text: string, _options?: ButtonOptions) {
        super(
            (
                <button
                    className="button"
                    onClick={(e: PointerEvent) => {
                        this._onClick.fire(e);
                        console.log(this._options);
                    }}>{text}</button>
            ),
            defaultOptions,
            _options
        );

        this._element.classList.add(`button-${this._options.variant}`);
        if(this._options.disabled) this._element.classList.add("button-disabled");
        if(this._options.width !== -1) this._element.style.width = `${this._options.width}px`;
        if(this._options.height !== -1) this._element.style.height = `${this._options.height}px`;

        this._register(this._onClick);
    }

    public get onClick() {
        return this._onClick.event;
    }
}
