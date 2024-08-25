import { Disposable, IDisposable } from "@/common/lifecycle";

export interface IComponent<E extends HTMLElement = HTMLElement> extends IDisposable {
    element: E
}

export abstract class Component<E extends HTMLElement = HTMLElement, O = any> extends Disposable implements IComponent<E> {
    protected _options: O;

    protected constructor(protected _element: E, defaultOptions: O, options?: O) {
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
