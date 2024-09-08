import type { Component } from "./ui";

import { Disposable } from "@/common/lifecycle";

const providerHolder: HTMLDivElement = <div class="provider-holder"/>;
document.body.appendChild(providerHolder);

const providerInstances: Map<any, Provider<any>> = new Map();

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
        return this._components.get(id);
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

export function registerProvider<P extends Provider<C>, C extends Component>(provider: any): P {
    if(providerInstances.has(provider)) {
        throw new Error("Cannot register the same provider twice.");
    }

    const instance = new provider();
    providerInstances.set(provider, instance);

    return instance;
}
