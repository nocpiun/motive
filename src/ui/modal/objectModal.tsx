import type { ObjectSettingsList } from "@/common/settings";
import type { ComponentLike } from "@/ui/ui";
import type { CanvasObject } from "@/simulator/object";

import { Check, SlidersHorizontal, Trash2 } from "lucide";

import { Emitter, type Event } from "@/common/event";
import { Form } from "@/ui/form/form";
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
    private _form: Form;

    public constructor(target: ComponentLike) {
        super(target, { id: "object-settings", title: "", icon: SlidersHorizontal });

        this._addFooterButton("save", { text: $("modal.object.save"), variant: "success", icon: Check }, "right", () => this._save());
        this._addFooterButton("cancel", { text: $("modal.object.cancel"), variant: "secondary" }, "right", () => this.close());
        this._addFooterButton("delete", { text: $("modal.object.delete"), variant: "danger", icon: Trash2 }, "left", () => this._deleteObject());

        // UI

        this._form = new Form(this._container);

        this._register(this._onSave);

        this._register(this.onShow((data) => {
            this._data = data;

            this._setTitle($("obj."+ data.id));

            this._form.registerList(data.items);
        }));

        this._register(this.onClose(() => {
            this._data = null;
            this._form.unregisterList();
        }));
    }

    private _save(): void {
        this._onSave.fire({
            obj: this._data.obj,
            items: this._form.submit()
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
