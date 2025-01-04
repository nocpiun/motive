import { Emitter, type Event } from "@/common/event";
import { Component, type ComponentLike, type IComponent } from "@/ui/ui";

export interface FormControlOptions {
    disabled?: boolean
    id?: string
}

const controlDefaultOptions: FormControlOptions = {
    disabled: false
};

export interface IFormControl<V> extends IComponent {
    value: V
    disabled: boolean
    id?: string

    reset(): void

    onDidChange: Event<V>
}

export abstract class FormControl<V, O, E extends HTMLElement = HTMLElement> extends Component<E, FormControlOptions & O> implements IFormControl<V> {
    // events
    protected _onDidChange = new Emitter<V>();

    public abstract value: V;
    public abstract disabled: boolean;

    protected constructor(element: E, target: ComponentLike, defaultOptions: O, _options: FormControlOptions & O) {
        super(element, target, { ...controlDefaultOptions, ...defaultOptions }, _options);

        if(this._options.id) this._element.id = this._options.id;

        this._register(this._onDidChange);
    }

    public get id() {
        return this._options.id;
    }

    public abstract reset(): void;

    public get onDidChange() {
        return this._onDidChange.event;
    }
}
