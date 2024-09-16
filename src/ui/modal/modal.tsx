import { createElement as createLucide, X } from "lucide";

import { Emitter, Event, Listener } from "@/common/event";
import { Component, ComponentLike, IComponent } from "@/ui/ui";
import { Button, ButtonOptions } from "@/ui/button/button";

import "./modal.less";

export interface ModalOptions {
    id: string
    title: string
    width?: number
    height?: number
}

const defaultOptions: ModalOptions = {
    id: "",
    title: "",
    width: 500,
    height: 400
};

export interface IModal extends IComponent {
    id: string

    show(): void
    close(): void

    onShow: Event<any>
    onClose: Event<any>
}

export class Modal extends Component<HTMLDialogElement, ModalOptions> implements IModal {
    // events
    private _onShow = new Emitter();
    private _onClose = new Emitter();

    protected readonly _container: HTMLDivElement;

    public constructor(target: ComponentLike, _options?: ModalOptions) {
        super(
            (
                <dialog className="modal-dialog" id={_options.id}>
                    <header className="modal-dialog-header">
                        <span className="modal-dialog-title">{_options.title}</span>
                        
                        <button
                            className="modal-dialog-close-button"
                            id={`modal.${_options.id}.close`}
                            onClick={() => this.close()}>
                            {createLucide(X)}
                        </button>
                    </header>
                    
                    <div className="modal-dialog-body"/>

                    <footer className="modal-dialog-footer"/>
                </dialog>
            ),
            target,
            defaultOptions,
            _options
        );

        if(this._options.width) this._element.style.width = `${this._options.width}px`;
        if(this._options.height) this._element.style.height = `${this._options.height}px`;

        this._container = this._element.querySelector(".modal-dialog-body");
    }

    public get id() {
        return this._options.id;
    }

    public show() {
        this._element.classList.add("opened");
        this._element.showModal();
        this._onShow.fire();
    }

    public close() {
        this._element.classList.remove("opened");
        this._element.close();
        this._onClose.fire();
    }

    protected _addFooterButton(id: string, options: ButtonOptions, onClick?: Listener<PointerEvent>) {
        const button = new Button(this._element.querySelector(".modal-dialog-footer"), { ...options, id: `modal.${this._options.id}.${id}` });
        button.element.classList.add("modal-dialog-button");

        if(onClick) button.onClick(onClick);

        this._register(button);
        return button;
    }

    public get onShow() {
        return this._onShow.event;
    }

    public get onClose() {
        return this._onClose.event;
    }

    public override dispose() {
        this.close();

        super.dispose();
    }
}
