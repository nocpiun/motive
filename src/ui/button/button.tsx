import { Disposable } from "@/common/lifecycle";
import { IComponent } from "@/ui/ui";
import { Emitter, Event } from "@/common/event";

import "./button.less";

interface ButtonOptions {
    // disabled?: boolean
}

const defaultOptions: ButtonOptions = {

};

interface IButton extends IComponent {
    text: string

    onClick: Event<PointerEvent>
}

export class Button extends Disposable implements IButton {
    private _element: HTMLElement;

    // events
    private _onClick = new Emitter<PointerEvent>();

    public constructor(public text: string, private _options?: ButtonOptions) {
        super();

        if(!_options) this._options = defaultOptions;

        this._element = (
            <button
                className="button"
                onClick={(e: PointerEvent) => this._onClick.fire(e)}>{text}</button>
        );

        this._register(this._onClick);
    }

    public get element() {
        return this._element;
    }

    public get onClick() {
        return this._onClick.event;
    }

    public override dispose() {
        super.dispose();

        this._element.remove();
        this._element = null;
    }
}
