"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hitbox = void 0;
const event_1 = require("@/common/event");
const lifecycle_1 = require("@/common/lifecycle");
class Hitbox extends lifecycle_1.Disposable {
    constructor(anchor) {
        super();
        this.anchor = anchor;
        // events
        this._onHit = new event_1.Emitter();
        this._isNextTestCancelled = false;
        this._register(this._onHit);
    }
    setAnchor(anchor) {
        this.anchor = anchor;
    }
    cancelNextTest() {
        this._isNextTestCancelled = true;
    }
    get onHit() {
        return this._onHit.event;
    }
}
exports.Hitbox = Hitbox;
