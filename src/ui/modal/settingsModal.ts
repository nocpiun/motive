import type { ComponentLike } from "@/ui/ui";

import { Check } from "lucide";

import { Modal } from "./modal";

export class SettingsModal extends Modal {

    public constructor(target: ComponentLike) {
        super(target, { id: "settings", title: "设置" });

        this._addFooterButton("save", { text: "保存", variant: "success", icon: Check }, "right", () => this.close());
        this._addFooterButton("cancel", { text: "取消", variant: "secondary" }, "right", () => this.close());
    }
}
