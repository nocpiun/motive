import type { CanvasObject } from "@/simulator/object";

import { Box, Check } from "lucide";

import { Emitter, type Event } from "@/common/event";
import { Component, type IComponent, type ComponentLike } from "@/ui/ui";
import { Form } from "@/ui/form/form";
import { $ } from "@/common/i18n";

import { Modal } from "./modal";

interface ManagerModalData {
    objects: CanvasObject[]
}

export class ManagerModal extends Modal<ManagerModalData> {
    private _objects: CanvasObject[];

    private _listElem: HTMLDivElement;
    private _listItems: ObjectListItem[] = [];
    private _form: Form;

    private _currentObject: CanvasObject | null = null;

    public constructor(target: ComponentLike) {
        super(target, { id: "manager", title: $("modal.manager.title"), icon: Box, width: 600 });
        
        // this._addFooterButton("clear", { text: $("modal.manager.clear"), variant: "danger", icon: Trash2 }, "left", () => {});
        this._addFooterButton("save", { text: $("modal.manager.save"), variant: "success", icon: Check }, "right", () => this._save());
        this._addFooterButton("apply", { text: $("modal.manager.apply"), variant: "success" }, "right", () => this._apply());
        this._addFooterButton("cancel", { text: $("modal.manager.cancel"), variant: "secondary" }, "right", () => this.close());

        // UI

        this._listElem = this._container.appendChild(<div className="object-list"/>);
        this._form = new Form(this._container);

        this._register(this.onShow(({ objects }) => {
            this._objects = objects;

            for(const obj of this._objects) {
                const isFirst = obj === this._objects[0];
                const item = new ObjectListItem(this._listElem, { id: obj.id, name: obj.name, obj, isDefault: isFirst });

                this._listItems.push(item);

                if(isFirst) this._setObjectPage(obj);

                item.onClick(() => {
                    this._setObjectPage(obj);

                    for(const listItem of this._listItems) {
                        if(listItem !== item) {
                            listItem.setActive(false);
                        }
                    }
                });
            }
        }));

        this._register(this.onClose(() => {
            this._reset();
        }));
    }

    private _setObjectPage(obj: CanvasObject): void {
        this._clearObjectPage();
        this._currentObject = obj;

        this._form.registerList(obj.getSettingsList());
    }

    private _clearObjectPage(): void {
        this._currentObject = null;

        this._form.unregisterList();
    }

    private _apply(): void {
        this._currentObject.applySettings(this._form.submit());
    }

    private _save(): void {
        this._apply();
        this.close();
    }

    private _reset(): void {
        this._clearObjectPage();

        for(const listItem of this._listItems) {
            listItem.dispose();
        }
        this._listItems = [];
    }

    public override dispose() {
        this._reset();

        super.dispose();
    }
}

interface ObjectListItemOptions {
    id: string
    name: string
    obj: CanvasObject
    isDefault?: boolean
}

const objectListItemDefaultOptions: ObjectListItemOptions = {
    id: "",
    name: "",
    obj: null,
    isDefault: false
};

interface IObjectListItem extends IComponent {
    onClick: Event<void>
}

class ObjectListItem extends Component<HTMLDivElement, ObjectListItemOptions> implements IObjectListItem {
    // events
    private _onClick = new Emitter();

    private _isActive: boolean = false;

    public constructor(target: ComponentLike, _options?: ObjectListItemOptions) {
        super(
            (
                <div className="object-list-item">
                    <span className="object-name">{_options.name}</span>
                    <span className="object-id">ID: {_options.id}</span>
                </div>
            ),
            target,
            objectListItemDefaultOptions,
            _options
        );

        if(this._options.isDefault) this.setActive(true);

        this._element.addEventListener("click", () => {
            this.setActive(true);

            this._onClick.fire();
        });

        this._register(this._onClick);
    }

    public setActive(isActive: boolean) {
        this._isActive = isActive;

        if(this._isActive) {
            this._element.classList.add("active");
        } else {
            this._element.classList.remove("active");
        }
    }

    public get onClick() {
        return this._onClick.event;
    }
}
