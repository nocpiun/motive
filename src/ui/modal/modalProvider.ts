import type { IDisposable } from "@/common/lifecycle";

import { Provider, registerProvider } from "@/ui/provider";
import { Modal } from "./modal";

// Modals
import { TestModal } from "./testModal";
import { SettingsModal } from "./settingsModal";
import { ManagerModal } from "./managerModal";

export interface IModalProvider extends IDisposable {
    open(id: string): void
    closeAll(): void
    getCurrentModal(): Modal | null
}

class ModalProvider extends Provider<Modal> implements IModalProvider {
    private _currentModalId: string | null = null;

    public constructor() {
        super("modal-provider");

        if(process.env.NODE_ENV === "test") this._registerModal(TestModal);
        this._registerModal(SettingsModal);
        this._registerModal(ManagerModal);
    }

    private _registerModal(modal: typeof Modal): void {
        const instance = new modal(this._providerElement);

        this._registerComponent(instance.id, instance);
    }

    public open(id: string) {
        if(this._currentModalId) {
            this._getComponent(this._currentModalId).close();
        }

        this._getComponent(id).show();
        this._currentModalId = id;
    }

    public closeAll() {
        this._components.forEach((modal) => modal.close());
        this._currentModalId = null;
    }

    public getCurrentModal() {
        if(!this._currentModalId) return null;

        return this._getComponent(this._currentModalId);
    }
}

export const modalProvider = registerProvider<ModalProvider, Modal>(ModalProvider);
