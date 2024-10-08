import type { Component } from "./ui";

import { Disposable } from "@/common/lifecycle";

export interface Anchor {
    x: number
    y: number
}

const providerHolder: HTMLDivElement = <div class="provider-holder"/>;
document.body.appendChild(providerHolder);

const providerInstances: Map<any, Provider<any>> = new Map();

/**
 * A provider holds and manages some components of a certain type,
 * which allows the components to be easily accessed and operated.
 * 
 * - The provider element (or the provider container), which holds the component elements, will be invisible.
 * - The components held by the provider will be positioned relatively to the whole page.
 */
export abstract class Provider<C extends Component> extends Disposable {
    protected _providerElement: HTMLDivElement;
    protected _components: Map<string, C> = new Map();

    protected constructor(private _id: string) {
        super();

        this._providerElement = Provider._createProviderElement(this._id);
    }

    private static _createProviderElement(id: string): HTMLDivElement {
        const elem = <div className="provider" id={id} data-provider/>;

        providerHolder.appendChild(elem);
        return elem;
    }

    protected _registerComponent(id: string, component: C): void {
        this._components.set(id, component);
    }

    protected _getComponent(id: string): C {
        try {
            return this._components.get(id);
        } catch (e) {
            throw new Error(`Component not found in the provider ${this._id}. Id: ${id}`);
        }
    }

    protected _removeComponent(id: string): void {
        const component = this._getComponent(id);
        component.dispose();

        this._components.delete(id);
    }

    protected _clearComponents(): void {
        this._components.forEach((component) => component.dispose());
        this._components.clear();
    }

    public override dispose() {
        super.dispose();

        this._clearComponents();
    }
}

/**
 * Initialize and register the new provider to the provider instances holder globally
 * 
 * @param provider The provider to register
 * @returns The instance of the provider
 */
export function registerProvider<P extends Provider<C>, C extends Component>(provider: any): P {
    if(!(provider.prototype instanceof Provider)) {
        throw new Error("Not a valid provider.");
    }

    if(providerInstances.has(provider)) {
        throw new Error("Cannot register the same provider twice.");
    }

    const instance = new provider();
    providerInstances.set(provider, instance);

    return instance;
}
