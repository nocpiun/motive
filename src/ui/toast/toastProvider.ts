import type { IDisposable } from "@/common/lifecycle";

import { Provider, registerProvider } from "@/ui/provider";
import { generateRandomID } from "@/common/utils/utils";

import { Toast, type ToastVariant } from "./toast";

export interface IToastProvider extends IDisposable {
    showToast(text: string, delay?: number, variant?: ToastVariant): Toast
    showTitleToast(title: string, text: string, delay?: number, variant?: ToastVariant): Toast
    closeToast(): void
}

class ToastProvider extends Provider<Toast> implements IToastProvider {
    private _timer: NodeJS.Timeout | null = null;

    public constructor() {
        super("toast-provider");
    }

    public showToast(text: string, delay: number = 3000, variant: ToastVariant = "secondary") {
        this.closeToast();

        const id = `toast.${generateRandomID()}`;
        const toast = new Toast(this._providerElement, { text, variant, id });
        
        this._registerComponent(id, toast);

        if(delay !== Infinity) {
            this._timer = setTimeout(() => {
                this._removeComponent(id);
                this._timer = null;
            }, delay);
        }

        return toast;
    }

    public showTitleToast(title: string, text: string, delay: number = 3000, variant: ToastVariant = "secondary") {
        this.closeToast();

        const id = `toast.${generateRandomID()}`;
        const toast = new Toast(this._providerElement, { title, text, variant, id });
        
        this._registerComponent(id, toast);
        
        if(delay !== Infinity) {
            this._timer = setTimeout(() => {
                this._removeComponent(id);
                this._timer = null;
            }, delay);
        }

        return toast;
    }

    public closeToast() {
        this._clearComponents();

        if(this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }

    public override dispose() {
        clearTimeout(this._timer);
        this._timer = null;

        super.dispose();
    }
}

export const toastProvider = registerProvider<ToastProvider, Toast>(ToastProvider);
