import type { ComponentLike } from "@/ui/ui";

import { Check, Settings as SettingsIcon } from "lucide";

import { Form } from "@/ui/form/form";
import { Settings, SettingsType } from "@/common/settings";
import { $ } from "@/common/i18n";

import { Modal } from "./modal";

export class SettingsModal extends Modal {
    private _form: Form;
    private _settings: Settings = Settings.get();

    public constructor(target: ComponentLike) {
        super(target, { id: "settings", title: $("modal.settings.title"), icon: SettingsIcon });

        this._addFooterButton("save", { text: $("modal.settings.save"), variant: "success", icon: Check }, "right", () => this.close());
        this._addFooterButton("cancel", { text: $("modal.settings.cancel"), variant: "secondary" }, "right", () => this.close());

        // UI

        this._form = new Form(this._container);

        this._initSettings();

        this._form.registerList(this._settings.getList(SettingsType.LOCAL));
    }

    private _initSettings(): void {
        /** @todo */
    }
}
