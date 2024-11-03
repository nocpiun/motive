"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
exports.registerProvider = registerProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
const lifecycle_1 = require("@/common/lifecycle");
const providerHolder = (0, jsx_runtime_1.jsx)("div", { class: "provider-holder" });
document.body.appendChild(providerHolder);
const providerInstances = new Map();
/**
 * A provider holds and manages some components of a certain type,
 * which allows the components to be easily accessed and operated.
 *
 * - The provider element (or the provider container), which holds the component elements, will be invisible.
 * - The components held by the provider will be positioned relatively to the whole page.
 */
class Provider extends lifecycle_1.Disposable {
    constructor(_id) {
        super();
        this._id = _id;
        this._components = new Map();
        this._providerElement = Provider._createProviderElement(this._id);
    }
    static _createProviderElement(id) {
        const elem = (0, jsx_runtime_1.jsx)("div", { className: "provider", id: id, "data-provider": true });
        providerHolder.appendChild(elem);
        return elem;
    }
    _registerComponent(id, component) {
        this._components.set(id, component);
    }
    _getComponent(id) {
        try {
            return this._components.get(id);
        }
        catch (e) {
            throw new Error(`Component not found in the provider ${this._id}. Id: ${id}`);
        }
    }
    _removeComponent(id) {
        const component = this._getComponent(id);
        component.dispose();
        this._components.delete(id);
    }
    _clearComponents() {
        this._components.forEach((component) => component.dispose());
        this._components.clear();
    }
    dispose() {
        super.dispose();
        this._clearComponents();
    }
}
exports.Provider = Provider;
/**
 * Initialize and register the new provider to the provider instances holder globally
 *
 * @param provider The provider to register
 * @returns The instance of the provider
 */
function registerProvider(provider) {
    if (!(provider.prototype instanceof Provider)) {
        throw new Error("Not a valid provider.");
    }
    if (providerInstances.has(provider)) {
        throw new Error("Cannot register the same provider twice.");
    }
    const instance = new provider();
    providerInstances.set(provider, instance);
    return instance;
}
