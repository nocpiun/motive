import type { IDisposable } from "@/common/lifecycle";

import { Provider, registerProvider } from "@/ui/provider";

// eslint-disable-next-line import/order
import type { Modal } from "./modal";

// Modals
import { TestModal } from "./testModal";
import { SettingsModal } from "./settingsModal";
import { ManagerModal } from "./managerModal";

export interface IModalProvider extends IDisposable {
    /**
     * Open a modal by its ID
     * 
     * @param id Modal ID
     */
    open(id: string): void
    /**
     * Close all modals
     */
    closeAll(): void
    /**
     * Get the currently opened modal
     * 
     * If there is no modal opened, it will return `null`.
     */
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
