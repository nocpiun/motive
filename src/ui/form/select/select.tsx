import type { ComponentLike } from "@/ui/ui";

import { ChevronDown, createElement as createLucide } from "lucide";

import { FormControl, type IFormControl, type FormControlOptions } from "@/ui/form/control";

import "./select.less";

export interface Selection {
    value: string
    text: string
}

export interface SelectOptions extends FormControlOptions {
    selections: Selection[]
    placeholder?: string
    defaultValue?: string
    width?: number
    height?: number
}

const defaultOptions: SelectOptions = {
    selections: [],
    placeholder: "",
    defaultValue: "",
    width: 200,
};

export interface ISelect extends IFormControl<string | null> {
    selections: Selection[]

    /**
     * Select a selection
     */
    select(value: string): void
    openList(): void
    closeList(): void
    /**
     * Clear the selection
     */
    reset(): void
}

export class Select extends FormControl<string | null, SelectOptions> implements ISelect {
    public readonly selections: Selection[];
    private _value: string | null = null;
    private _isOpened: boolean = false;

    private _selectButton: HTMLButtonElement;
    private _selectButtonLabel: HTMLSpanElement;
    private _selectListElem: HTMLDivElement;

    public constructor(target: ComponentLike, _options?: SelectOptions) {
        super(
            (
                <div className="select">
                    <button className="select-button">
                        <span className="select-button-label"></span>
                        <div className="icon-wrapper">
                            {createLucide(ChevronDown)}
                        </div>
                    </button>

                    <div className="select-list">
                        {
                            _options.selections.map(({ value, text }, index) => (
                                <div className="select-list-item" data-value={value} key={index}>
                                    <button onClick={() => {
                                        this.select(value);
                                        this.closeList();
                                    }}>{text}</button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            ),
            target,
            defaultOptions,
            _options
        );

        this._selectButton = this._element.querySelector(".select-button");
        this._selectButtonLabel = this._selectButton.querySelector(".select-button-label");
        this._selectListElem = this._element.querySelector(".select-list");

        if(this._options.selections.length === 0) throw new Error("Cannot create an empty select component.");

        this.selections = this._options.selections;
        if(this._options.placeholder) this._selectButtonLabel.textContent = this._options.placeholder;
        if(this._options.defaultValue) {
            this.select(this._options.defaultValue);
        } else if(!this._options.placeholder) {
            this.select(this.selections[0].value);
        }
        if(this._options.disabled) this.disabled = this._options.disabled;
        if(this._options.width) this._element.style.width = this._selectButton.style.width = `${this._options.width}px`;
        if(this._options.height) this._element.style.height = this._selectButton.style.height = `${this._options.height}px`;

        this._selectButton.addEventListener("click", () => {
            this._isOpened
            ? this.closeList()
            : this.openList();
        });

        // Remove the selection menu when the user clicks outside
        document.body.addEventListener("mousedown", (e) => {
            if(!(e.target as HTMLElement).closest(".select")) {
                this.closeList();
            }
        });
        window.addEventListener("blur", () => this.closeList());
    }

    private set value(value) {
        if(value) {
            this._value = value;
            this._selectButtonLabel.textContent = this._getSelection(value).text;
        } else if(this._options.placeholder) {
            this._value = value;
            this._selectButtonLabel.textContent = this._options.placeholder;
        } else if(this._options.defaultValue) {
            this.value = this._options.defaultValue;
        } else {
            this.value = this.selections[0].value;
        }

        this._onDidChange.fire(this._value);
    }

    public get value() {
        return this._value;
    }

    public set disabled(disabled) {
        disabled
        ? this._element.classList.add("select-disabled")
        : this._element.classList.remove("select-disabled");
    }

    public get disabled() {
        return this._options.disabled;
    }

    private _getSelection(value: string): Selection | never {
        for(const selection of this.selections) {
            if(selection.value === value) return selection;
        }
        throw new Error("Cannot find the selection \""+ value +"\".");
    }

    private _hasSelectionValue(value: string): boolean {
        for(const selection of this.selections) {
            if(selection.value === value) return true;
        }
        return false;
    }

    public select(value: string | null) {
        if(value && !this._hasSelectionValue(value)) throw new Error("Cannot select an inexisting selection \""+ value +"\".");

        this.value = value;
    }

    public openList() {
        if(this._isOpened || this.disabled) return;
        this._isOpened = true;

        this._element.classList.add("opened");
        this._selectListElem.style.top = this._options.height +"px";
    }

    public closeList() {
        if(!this._isOpened) return;
        this._isOpened = false;

        this._element.classList.remove("opened");
    }

    public reset() {
        this.value = null;
    }
}
