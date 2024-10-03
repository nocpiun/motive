import { Emitter, type Event } from "@/common/event";
import { Disposable, type IDisposable } from "@/common/lifecycle";

export interface IComponent<E extends HTMLElement = HTMLElement> extends IDisposable {
    element: E

    onHover: Event<MouseEvent>
    onUnhover: Event<MouseEvent>
}

export type ComponentLike<E extends HTMLElement = HTMLElement> = E | Element | IComponent<E>;

/**
 * Append an element to a component or an element
 * 
 * @param element The element to append
 * @param target The target to be appended
 */
function append(element: HTMLElement, target: ComponentLike): void {
    if(target instanceof HTMLElement) {
        target.appendChild(element);
    } else if(target instanceof Component) {
        (target.element as HTMLElement).appendChild(element);
    }
}

/**
 * A component is a basic unit in the UI, holding and managing an element and its child(ren),
 * providing some basic events to use.
 * 
 * A component can be registered to a `Provider`.
 */
export abstract class Component<E extends HTMLElement = HTMLElement, O = any> extends Disposable implements IComponent<E> {
    protected _options: O;

    // events
    private _onHover = new Emitter<MouseEvent>();
    private _onUnhover = new Emitter<MouseEvent>();

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

        this._element.addEventListener("mouseenter", (e) => this._onHover.fire(e));
        this._element.addEventListener("mouseleave", (e) => this._onUnhover.fire(e));
        this._element.addEventListener("contextmenu", (e) => e.preventDefault());

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

/**
 * A utility function to create DOM element and append the element to a component or an element.
 * 
 * @returns The new element
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, target: ComponentLike): HTMLElementTagNameMap[K] {
    const elem = document.createElement(tagName);
    append(elem, target);
    
    return elem;
}
