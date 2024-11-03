"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emitter = void 0;
const linkedNodes_1 = require("./utils/linkedNodes");
const lifecycle_1 = require("./lifecycle");
class Emitter extends lifecycle_1.Disposable {
    constructor() {
        super(...arguments);
        this._listeners = linkedNodes_1.LinkedNodes.empty();
    }
    get event() {
        if (this._isDisposed)
            throw new Error("Cannot register listener to a disposed emitter.");
        return (callback) => this._registerListener(callback);
    }
    get onceEvent() {
        if (this._isDisposed)
            throw new Error("Cannot register listener to a disposed emitter.");
        return (callback) => this._registerListener(callback, true);
    }
    _registerListener(callback, once = false) {
        const stored = this._listeners.push(callback);
        const disposable = {
            dispose: () => {
                this._listeners.remove(stored);
            }
        };
        callback.disposable = disposable;
        callback.once = once;
        this._register(disposable);
        return disposable;
    }
    /**
     * Fires all registered listeners in the emitter
     */
    fire(data) {
        if (this._isDisposed)
            return;
        for (const listener of this._listeners) {
            listener(data);
            if (listener.once) {
                listener.disposable.dispose();
            }
        }
    }
}
exports.Emitter = Emitter;
