import type { SettingsItem, SettingsList } from "@/common/settings";
import type { FormControl } from "./control";

import { createElement as createLucide } from "lucide";

import { Emitter, type Event } from "@/common/event";
import { Component, type ComponentLike, type IComponent } from "@/ui/ui";
import { Switcher, type SwitcherOptions } from "@/ui/switcher/switcher";
import { Toggle, type ToggleOptions } from "@/ui/toggle/toggle";
import { deepClone } from "@/common/utils/utils";

import { Input, type InputOptions } from "./input/input";
import { Select, type SelectOptions } from "./select/select";

import "./form.less";

interface FormItem {
    label: string
    component: FormControl<any, any>
}

export interface FormOptions {
    id?: string
}

const defaultOptions: FormOptions = { };

export interface IForm extends IComponent {
    id?: string

    registerList<I extends SettingsItem>(list: SettingsList<I>): void
    unregisterList(): void
    submit(): SettingsList<any>

    onSubmit: Event<SettingsList<any>>
}

export class Form extends Component<HTMLFormElement, FormOptions> implements IForm {
    // events
    private _onSubmit = new Emitter<SettingsList<any>>();

    private _list: SettingsList<any> | null = null;
    private _itemComponents: Map<string, FormItem> = new Map();
    
    public constructor(target: ComponentLike, _options?: FormOptions) {
        super(
            (
                <form className="form"></form>
            ),
            target,
            defaultOptions,
            _options
        );

        if(this._options.id) this._element.id = this._options.id;

        this._element.addEventListener("submit", (e) => e.preventDefault());
    }

    public get id() {
        return this._options.id;
    }

    private _addItem(key: string, item: SettingsItem) {
        const itemElem: HTMLDivElement = (
            <div className="form-item" id={key}>
                {
                    item.description && (
                        <div className="form-item-description">
                            <span>{item.description}</span>
                        </div>
                    )
                }
                <div className="form-item-main">
                    <div className="form-item-label">
                        {item.icon && (
                            <div className="icon-wrapper">
                                {createLucide(item.icon)}
                            </div>
                        )}
                        <span>{item.name}</span>
                    </div>
                    <div className="form-item-control"/>
                </div>
            </div>
        );
        const controlContainer = itemElem.querySelector(".form-item-control");
        const type = item.type ?? "input";
        let component;
        
        switch(type) {
            case "input": {
                component = new Input(controlContainer, {
                    defaultValue: typeof item.value === "number" ? item.value.toString() : item.value as string,
                    ...item.controlOptions as InputOptions
                });

                (component as Input).onInput((value) => {
                    this._list[key].value = value;
                });
                break;
            }
            case "switcher": {
                component = new Switcher(controlContainer, {
                    defaultValue: item.value as boolean,
                    ...item.controlOptions as SwitcherOptions
                });

                (component as Switcher).onDidChange(({ isActive }) => {
                    this._list[key].value = isActive;
                });
                break;
            }
            case "select": {
                component = new Select(controlContainer, {
                    defaultValue: item.value as string,
                    ...item.controlOptions as SelectOptions
                });

                (component as Select).onDidChange((value) => {
                    this._list[key].value = value;
                });
                break;
            }
            case "toggle": {
                component = new Toggle(controlContainer, {
                    defaultValue: item.value as boolean,
                    ...item.controlOptions as ToggleOptions
                });

                (component as Toggle).onDidChange((isActive) => {
                    this._list[key].value = isActive;
                });
                break;
            }
        }

        this._itemComponents.set(key, { label: item.name, component });
        this._element.appendChild(itemElem);
    }

    public registerList<I extends SettingsItem>(list: SettingsList<I>): void {
        this.unregisterList();

        this._list = deepClone(list);

        for(const [key, item] of Object.entries(this._list)) {
            this._addItem(key, item);
        }
    }

    public unregisterList() {
        for(const item of this._itemComponents.values()) {
            item.component.dispose();
        }

        this._list = null;
        this._itemComponents.clear();
        this._element.innerHTML = "";
    }

    public submit() {
        this._onSubmit.fire(this._list);
        return this._list;
    }

    public get onSubmit() {
        return this._onSubmit.event;
    }

    public override dispose() {
        this.unregisterList();

        super.dispose();
    }
}
