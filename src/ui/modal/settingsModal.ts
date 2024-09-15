import { ComponentLike } from "@/ui/ui";

import { Modal } from "./modal";

export class SettingsModal extends Modal {

    public constructor(target: ComponentLike) {
        super(target, { id: "settings", title: "设置" });

        this._addFooterButton("save", { text: "保存", variant: "primary" }, () => this.close());
    }
}
