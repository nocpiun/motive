import type { ComponentLike } from "@/ui/ui";

import { Emitter, type Event } from "@/common/event";
import { FormControl, type IFormControl, type FormControlOptions } from "@/ui/form/control";

import "./input.less";

type InputType = "text" | "number";

export interface InputOptions extends FormControlOptions {
    type?: InputType
    placeholder?: string
    defaultValue?: string
    width?: number
    height?: number
    maxLength?: number
    minValue?: number // number type input only
    maxValue?: number // number type input only
}

const defaultOptions: InputOptions = {
    type: "text",
    placeholder: "",
    defaultValue: "",
    width: 200,
    maxLength: Infinity,
    minValue: -Infinity,
    maxValue: Infinity
};

export interface IInput extends IFormControl<string> {
    /**
     * Type a string into the input
     * 
     * @example
     * // input.value === "hello"
     * input.type(" world");
     * // input.value === "hello world"
     */
    type(text: string): void

    onInput: Event<string>
}

export class Input extends FormControl<string, InputOptions, HTMLInputElement> implements IInput {
    // events
    private _onInput = new Emitter<string>();

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

        this._register(this._onInput);
    }

    private _validate(value: string): boolean {
        if(value.length > this._options.maxLength) return false;

        switch(this._options.type) {
            case "text":
                return true;
            case "number": {
                const num = Number(value);

                if(isNaN(num)) return false;
                if(num < this._options.minValue || num > this._options.maxValue) return false;

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
}
