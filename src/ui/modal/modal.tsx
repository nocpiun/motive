import { createElement as createLucide, X } from "lucide";

import { Emitter, type Event, type Listener } from "@/common/event";
import { Component, type ComponentLike, type IComponent } from "@/ui/ui";
import { Button, type ButtonOptions } from "@/ui/button/button";

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

export interface IModal<D = any> extends IComponent {
    id: string

    show(): void
    close(): void

    onShow: Event<D>
    onClose: Event<void>
}

export class Modal<D = any> extends Component<HTMLDialogElement, ModalOptions> implements IModal<D> {
    // events
    private _onShow = new Emitter<D>();
    private _onClose = new Emitter();

    protected readonly _container: HTMLDivElement;

    public constructor(target: ComponentLike, _options?: ModalOptions) {
        super(
            (
                <dialog className="modal-dialog" id={_options.id}>
                    <div className="modal-dialog-backdrop"/>

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

                    <footer className="modal-dialog-footer">
                        <div className="footer-left-split"/>
                        <div className="footer-right-split"/>
                    </footer>
                </dialog>
            ),
            target,
            defaultOptions,
            _options
        );

        if(this._options.width) this._element.style.width = `${this._options.width}px`;
        if(this._options.height) this._element.style.height = `${this._options.height}px`;

        this._container = this._element.querySelector(".modal-dialog-body");

        this._register(this._onShow);
        this._register(this._onClose);
    }

    public get id() {
        return this._options.id;
    }

    public show(data?: D) {
        this._element.classList.add("opened");
        document.getElementById("dialog-backdrop").classList.add("active");
        this._element.show();
        this._onShow.fire(data);
    }

    public close() {
        this._element.classList.remove("opened");
        document.getElementById("dialog-backdrop").classList.remove("active");
        this._element.close();
        this._onClose.fire();
    }

    protected _setTitle(title: string): void {
        this._options.title = title;
        this._element.querySelector(".modal-dialog-title").textContent = title;
    }

    protected _addFooterButton(id: string, options: ButtonOptions, dock: "left" | "right" = "right", onClick?: Listener<PointerEvent>) {
        const button = new Button(this._element.querySelector(`.footer-${dock}-split`), { ...options, id: `modal.${this._options.id}.${id}` });
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
