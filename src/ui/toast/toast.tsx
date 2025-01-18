import { createElement as createLucide, X } from "lucide";

import { Component, type ComponentLike, type IComponent } from "@/ui/ui";

import { toastProvider } from "./toastProvider";
import "./toast.less";

export type ToastVariant = "secondary" | "success" | "danger";

export interface ToastOptions {
    id?: string
    title?: string
    text: string
    variant?: ToastVariant
}

const defaultOptions: ToastOptions = {
    title: "",
    text: "",
    variant: "secondary"
};

export interface IToast extends IComponent {
    text: string
    title?: string
    variant: ToastVariant
    id?: string
}

export class Toast extends Component<HTMLDivElement, ToastOptions> implements IToast {
    public variant: ToastVariant;
    
    public constructor(target: ComponentLike, _options?: ToastOptions) {
        super(
            (
                <div className="toast">
                    <div className="toast-close">
                        <button onClick={() => toastProvider.closeToast()}>
                            {createLucide(X)}
                        </button>
                    </div>
                    <div className="toast-main">
                        {_options.title && <span className="toast-title">{_options.title}</span>}
                        <span className="toast-text">{_options.text}</span>
                    </div>
                </div>
            ),
            target,
            defaultOptions,
            _options
        );

        this._element.classList.add(`toast-${this._options.variant}`);
        if(this._options.variant) this.variant = this._options.variant;
        if(this._options.id) this._element.id = this._options.id;

        // Appearing animation
        setTimeout(() => {
            this._element.style.transform = "translateY(0)";
        }, 50);
    }

    public get text() {
        return this._options.text;
    }

    public get title() {
        return this._options.title;
    }

    public get id() {
        return this._options.id;
    }

    public override dispose() {
        this._element.style.transform = "";
        setTimeout(() => {
            super.dispose();
        }, 50);
    }
}
