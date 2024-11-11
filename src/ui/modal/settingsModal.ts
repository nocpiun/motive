import type { ComponentLike } from "@/ui/ui";

import { Check } from "lucide";

import { $ } from "@/common/i18n";

import { Modal } from "./modal";

export class SettingsModal extends Modal {

    public constructor(target: ComponentLike) {
        super(target, { id: "settings", title: $("modal.settings.title") });

        this._addFooterButton("save", { text: $("modal.settings.save"), variant: "success", icon: Check }, "right", () => this.close());
        this._addFooterButton("cancel", { text: $("modal.settings.cancel"), variant: "secondary" }, "right", () => this.close());
    }
}
