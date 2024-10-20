import type { ComponentLike } from "@/ui/ui";

import { Check } from "lucide";

import { Modal } from "./modal";

interface ObjectModalData {
    id: string
    name: string
}

export class ObjectModal extends Modal<ObjectModalData> {
    private _data: ObjectModalData;

    public constructor(target: ComponentLike) {
        super(target, { id: "object-settings", title: "" });

        this._addFooterButton("save", { text: "保存", variant: "success", icon: Check }, "right", () => this.close());
        this._addFooterButton("cancel", { text: "取消", variant: "secondary" }, "right", () => this.close());

        this._register(this.onShow((data) => {
            this._data = data;

            this._setTitle(data.id);
        }));
    }
}
