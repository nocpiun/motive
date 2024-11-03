"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
exports.createElement = createElement;
const event_1 = require("@/common/event");
const lifecycle_1 = require("@/common/lifecycle");
/**
 * Append an element to a component or an element
 *
 * @param element The element to append
 * @param target The target to be appended
 */
function append(element, target) {
    if (target instanceof HTMLElement) {
        target.appendChild(element);
    }
    else if (target instanceof Component) {
        target.element.appendChild(element);
    }
}
/**
 * A component is a basic unit in the UI, holding and managing an element and its child(ren),
 * providing some basic events to use.
 *
 * A component can be registered to a `Provider`.
 */
class Component extends lifecycle_1.Disposable {
    constructor(_element, target, defaultOptions, options) {
        super();
        this._element = _element;
        // events
        this._onHover = new event_1.Emitter();
        this._onUnhover = new event_1.Emitter();
        if (!options) {
            this._options = defaultOptions;
        }
        else {
            for (const [key, value] of Object.entries(defaultOptions)) {
                let hasKey = false;
                for (const _key of Object.keys(options)) {
                    if (_key === key) {
                        hasKey = true;
                        break;
                    }
                }
                if (!hasKey) {
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
    get element() {
        return this._element;
    }
    get onHover() {
        return this._onHover.event;
    }
    get onUnhover() {
        return this._onUnhover.event;
    }
    dispose() {
        super.dispose();
        this._element.remove();
        this._element = null;
    }
}
exports.Component = Component;
/**
 * A utility function to create DOM element and append the element to a component or an element.
 *
 * @returns The new element
 */
function createElement(tagName, target) {
    const elem = document.createElement(tagName);
    append(elem, target);
    return elem;
}
