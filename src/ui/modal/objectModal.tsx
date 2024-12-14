import type { ObjectSettingsItem, ObjectSettingsList } from "@/common/settings";
import type { ComponentLike } from "@/ui/ui";
import type { CanvasObject } from "@/simulator/object";

import { Check, SlidersHorizontal, Trash2 } from "lucide";

import { Emitter, type Event } from "@/common/event";
import { Input, type InputOptions } from "@/ui/form/input/input";
import { $ } from "@/common/i18n";

import { Modal } from "./modal";

interface ObjectModalData {
    id: string
    obj: CanvasObject
    items: ObjectSettingsList
}

interface OnSaveListenerData {
    obj: CanvasObject
    items: ObjectSettingsList
}

interface IObjectModal {
    onSave: Event<OnSaveListenerData>
}

export class ObjectModal extends Modal<ObjectModalData> implements IObjectModal {
    // events
    private _onSave = new Emitter<OnSaveListenerData>();

    private _data: ObjectModalData | null = null;
    private _listElem: HTMLDivElement;

    public constructor(target: ComponentLike) {
        super(target, { id: "object-settings", title: "", icon: SlidersHorizontal });

        this._addFooterButton("save", { text: $("modal.object.save"), variant: "success", icon: Check }, "right", () => this._save());
        this._addFooterButton("cancel", { text: $("modal.object.cancel"), variant: "secondary" }, "right", () => this.close());
        this._addFooterButton("delete", { text: $("modal.object.delete"), variant: "danger", icon: Trash2 }, "left", () => this._deleteObject());

        // UI

        this._listElem = this._container.appendChild(<div className="settings-list"/>);

        this._register(this._onSave);

        this._register(this.onShow((data) => {
            this._data = data;

            this._setTitle($("obj."+ data.id));

            for(const [key, item] of Object.entries(data.items)) {
                this._addItem(key, item);
            }
        }));

        this._register(this.onClose(() => {
            this._data = null;
            this._clearItems();
        }));
    }

    private _addItem<V>(key: string, item: ObjectSettingsItem<V>): void {
        const type = item.type ?? "input";
        const itemElem = (
            <div className="settings-list-item">
                <span>{item.name}</span>
                <div className="settings-list-item-control"/>
            </div>
        );

        switch(type) {
            case "input": {
                const input = new Input(itemElem.querySelector(".settings-list-item-control"), {
                    defaultValue: typeof item.value === "number" ? item.value.toString() : item.value as string,
                    ...item.controlOptions as InputOptions
                });

                input.onInput((newValue) => {
                    this._data.items[key].value = newValue;
                });
                break;
            }
            case "switcher": {
                /** @todo */
                break;
            }
        }

        this._listElem.appendChild(itemElem);
    }

    private _clearItems(): void {
        this._listElem.innerHTML = "";
    }

    private _save(): void {
        this._onSave.fire({
            obj: this._data.obj,
            items: this._data.items
        });
        this.close();
    }

    private _deleteObject(): void {
        const obj = this._data.obj;

        obj.render.deleteObject(obj);
        this.close();
    }

    public get onSave() {
        return this._onSave.event;
    }
}
