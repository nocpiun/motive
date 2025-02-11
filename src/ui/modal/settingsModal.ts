import type { ComponentLike } from "@/ui/ui";

import { Check, Settings as SettingsIcon } from "lucide";

import { Form } from "@/ui/form/form";
import { type GlobalSettingsList, Settings, SettingsType } from "@/common/settings";
import { toastProvider } from "@/ui/toast/toastProvider";
import { $ } from "@/common/i18n";
import defaultLocalSettings from "@/assets/defaultLocalSettings";

import { Modal } from "./modal";

export class SettingsModal extends Modal {
    private _form: Form;
    private _settings: Settings = Settings.get();

    public constructor(target: ComponentLike) {
        super(target, { id: "settings", title: $("modal.settings.title"), icon: SettingsIcon });

        this._addFooterButton("save", { text: $("modal.settings.save"), variant: "success", icon: Check }, "right", () => this._save());
        this._addFooterButton("cancel", { text: $("modal.settings.cancel"), variant: "secondary" }, "right", () => this._cancel());
        this._addFooterButton("recover", { text: $("modal.settings.recover"), variant: "secondary" }, "left", () => this._recoverDefault());

        // UI

        this._form = new Form(this._container);

        this._register(this.onShow(() => {
            this._form.registerList(this._settings.getList(SettingsType.LOCAL));
        }));

        this._register(this._settings.onDidChange(({ key }) => {
            if(key === "language") {
                window.location.reload();
            }
        }));
    }

    private _save(): void {
        const unsavedSettings = this._form.submit() as GlobalSettingsList;

        this._settings.storeList(unsavedSettings);
        this.close();

        toastProvider.showTitleToast("设置", "保存成功", 3000, "success");
    }

    private _cancel(): void {
        this._form.registerList(this._settings.getList(SettingsType.LOCAL));

        this.close();
    }

    private _recoverDefault(): void {
        this._form.registerList(defaultLocalSettings);
        this._settings.storeList(defaultLocalSettings);
    }
}
