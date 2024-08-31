import { Disposable, IDisposable } from "@/common/lifecycle";

export interface IComponent<E extends HTMLElement = HTMLElement> extends IDisposable {
    element: E
}

export type ComponentLike<E extends HTMLElement = HTMLElement> = E | IComponent<E>;

function append(element: HTMLElement, target: ComponentLike): void {
    if(target instanceof HTMLElement) {
        target.appendChild(element);
    } else if(target instanceof Component) {
        (target.element as HTMLElement).appendChild(element);
    }
}

export abstract class Component<E extends HTMLElement = HTMLElement, O = any> extends Disposable implements IComponent<E> {
    protected _options: O;

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
    }

    public get element(): E {
        return this._element;
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
