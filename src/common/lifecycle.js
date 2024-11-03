"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disposable = void 0;
class Disposable {
    constructor() {
        this._store = new Set();
        this._isDisposed = false;
    }
    dispose() {
        if (this._isDisposed)
            return;
        this._store.forEach((item) => {
            item.dispose();
        });
        this._store.clear();
        this._isDisposed = true;
    }
    _register(disposable) {
        if (this._isDisposed)
            return;
        if (disposable === this)
            throw new Error("Cannot register a disposable object to itself.");
        this._store.add(disposable);
    }
}
exports.Disposable = Disposable;
