import { Emitter, type Event } from "@/common/event";
import { Disposable, type IDisposable } from "@/common/lifecycle";

export interface IComponent<E extends HTMLElement = HTMLElement> extends IDisposable {
    element: E

    onHover: Event<void>
    onUnhover: Event<void>
}

export type ComponentLike<E extends HTMLElement = HTMLElement> = E | Element | IComponent<E>;

function append(element: HTMLElement, target: ComponentLike): void {
    if(target instanceof HTMLElement) {
        target.appendChild(element);
    } else if(target instanceof Component) {
        (target.element as HTMLElement).appendChild(element);
    }
}

export abstract class Component<E extends HTMLElement = HTMLElement, O = any> extends Disposable implements IComponent<E> {
    protected _options: O;

    // events
    private _onHover = new Emitter();
    private _onUnhover = new Emitter();

    protected constructor(protected _element: E, target: ComponentLike, defaultOptions: O, options?: O) {
        super();

        if(!options) {
            this._options = defaultOptions;
        } else {
            for(const [key, value] of Object.entries(defaultOptions)) {
                let hasKey = false;
                for(const _key of Object.keys(options)) {
                    if(_key === key) {
                        hasKey = true;
                        break;
                    }
                }
    
                if(!hasKey) {
                    options[key] = value;
                }
            }

            this._options = options;
        }

        append(this._element, target);

        this._element.setAttribute("data-component", "");

        this._element.addEventListener("mouseenter", () => this._onHover.fire());
        this._element.addEventListener("mouseleave", () => this._onUnhover.fire());

        this._register(this._onHover);
        this._register(this._onUnhover);
    }

    public get element(): E {
        return this._element;
    }

    public get onHover() {
        return this._onHover.event;
    }

    public get onUnhover() {
        return this._onUnhover.event;
    }

    public override dispose() {
        super.dispose();

        this._element.remove();
        this._element = null;
    }
}

export function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, target: ComponentLike): HTMLElementTagNameMap[K] {
    const elem = document.createElement(tagName);
    append(elem, target);
    
    return elem;
}
