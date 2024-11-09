import type { IDisposable } from "@/common/lifecycle";

import { Provider, registerProvider } from "@/ui/provider";
import { Emitter, type Event } from "@/common/event";

// eslint-disable-next-line import/order
import type { Modal } from "./modal";

// Modals
import { TestModal } from "./testModal";
import { SettingsModal } from "./settingsModal";
import { ManagerModal } from "./managerModal";
import { AboutModal } from "./aboutModal";
import { ObjectModal } from "./objectModal";
import { ImportModal } from "./importModal";

export interface IModalProvider extends IDisposable {
    /**
     * Open a modal by its ID
     * 
     * @param id Modal ID
     * @param data Modal data
     */
    open(id: string, data?: any): void
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

    onModalOpen: Event<string>
    onModalClose: Event<void>
}

class ModalProvider extends Provider<Modal> implements IModalProvider {
    // events
    private _onModalOpen = new Emitter<string>();
    private _onModalClose = new Emitter();

    private _currentModalId: string | null = null;

    public constructor() {
        super("modal-provider");

        document.body.appendChild(
            <div className="modal-dialog-backdrop" id="dialog-backdrop" onContextMenu={(e) => e.preventDefault()}/>
        );

        process.env.NODE_ENV === "test" && this._registerModal(TestModal);
        this._registerModal(SettingsModal);
        this._registerModal(ManagerModal);
        this._registerModal(AboutModal);
        this._registerModal(ObjectModal);
        this._registerModal(ImportModal);

        this._register(this._onModalOpen);
        this._register(this._onModalClose);
    }

    private _registerModal(modal: typeof Modal<any>): void {
        const instance = new modal(this._providerElement);

        this._registerComponent(instance.id, instance);

        this._register(instance.onClose(() => {
            this._onModalClose.fire();
        }));
    }

    public open(id: string, data?: any) {
        if(this._currentModalId) {
            this._getComponent(this._currentModalId).close();
        }

        this._getComponent(id).show(data);
        this._currentModalId = id;

        this._onModalOpen.fire(id);
    }

    public closeAll() {
        this._components.forEach((modal) => modal.close());
        this._currentModalId = null;

        this._onModalClose.fire();
    }

    public getCurrentModal() {
        if(!this._currentModalId) return null;

        return this._getComponent(this._currentModalId);
    }

    public get onModalOpen() {
        return this._onModalOpen.event;
    }

    public get onModalClose() {
        return this._onModalClose.event;
    }
}

export const modalProvider = registerProvider<ModalProvider, Modal>(ModalProvider);
