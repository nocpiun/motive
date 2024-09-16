import { Emitter, Event } from "@/common/event";
import { Component, ComponentLike, IComponent } from "@/ui/ui";

import "./input.less";

type InputType = "text" | "number";

export interface InputOptions {
    type?: InputType
    placeholder?: string
    defaultValue?: string
    width?: number
    height?: number
    disabled?: boolean
    maxLength?: number
    maxValue?: number // number type input only
    id?: string
}

const defaultOptions: InputOptions = {
    type: "text",
    placeholder: "",
    defaultValue: "",
    disabled: false,
    maxLength: Infinity,
    maxValue: Infinity
};

export interface IInput extends IComponent {
    value: string
    disabled: boolean
    id?: string

    type(text: string): void
    reset(): void

    onInput: Event<string>
    onDidChange: Event<string>
}

export class Input extends Component<HTMLInputElement, InputOptions> implements IInput {
    // events
    private _onInput = new Emitter<string>();
    private _onDidChange = new Emitter<string>();

    public constructor(target: ComponentLike, _options?: InputOptions) {
        super(
            (
                <input
                    className="input"
                    onChange={() => {
                        this._onDidChange.fire(this.value);
                    }}
                    onInput={(e: InputEvent) => {
                        if(!this._validate(this.value)) {
                            e.preventDefault();
                            this.value = this.value.substring(0, this.value.length - 1);

                            return;
                        }

                        this._onInput.fire(this.value);
                    }}/>
            ),
            target,
            defaultOptions,
            _options
        );

        this._element.setAttribute("data-type", this._options.type);
        if(this._options.placeholder) this._element.placeholder = this._options.placeholder;
        if(this._options.defaultValue) this.value = this._options.defaultValue;
        if(this._options.disabled) this.disabled = this._options.disabled;
        if(this._options.width) this._element.style.width = `${this._options.width}px`;
        if(this._options.height) this._element.style.height = `${this._options.height}px`;
        if(this._options.id) this._element.id = this._options.id;

        this._register(this._onInput);
        this._register(this._onDidChange);
    }

    private _validate(value: string): boolean {
        if(value.length > this._options.maxLength) return false;

        switch(this._options.type) {
            case "text":
                return true;
            case "number": {
                const num = Number(value);

                if(isNaN(num)) return false;
                if(num > this._options.maxValue) return false;

                return true;
            }
        }
    }

    public set value(value) {
        this._element.value = value;
    }

    public get value() {
        return this._element.value;
    }

    public set disabled(disabled) {
        disabled
        ? this._element.classList.add("input-disabled")
        : this._element.classList.remove("input-disabled");

        this._element.disabled = disabled;
        this._options.disabled = disabled;
    }

    public get disabled() {
        return this._options.disabled;
    }

    public get id() {
        return this._options.id;
    }

    public type(text: string) {
        if(this._options.disabled || !this._validate(this.value + text)) return;

        this.value += text;

        this._onInput.fire(this.value);
        this._onDidChange.fire(this.value);
    }

    public reset() {
        this.value = "";
    }

    public get onInput() {
        return this._onInput.event;
    }

    public get onDidChange() {
        return this._onDidChange.event;
    }

    public override dispose() {
        this.reset();

        super.dispose();
    }
}
