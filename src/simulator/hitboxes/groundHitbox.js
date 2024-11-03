"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroundHitbox = void 0;
const hitbox_1 = require("@/simulator/hitbox");
const block_1 = require("@/simulator/objects/block");
const roundHitbox_1 = require("./roundHitbox");
class GroundHitbox extends hitbox_1.Hitbox {
    constructor(anchor) {
        super(anchor);
    }
    test(obj) {
        const hitbox = obj.hitbox;
        if (this._isNextTestCancelled) {
            this._isNextTestCancelled = false;
            return;
        }
        if (hitbox instanceof roundHitbox_1.RoundHitbox) {
            const distance = this.anchor.y - hitbox.anchor.y;
            if (distance <= hitbox.radius * 2) {
                this._onHit.fire({ obj, depth: hitbox.radius - distance });
            }
        }
        else if (obj instanceof block_1.Block) { // special type of ConvexHitbox
            const distance = this.anchor.y - obj.hitbox.anchor.y - obj.size / 2;
            if (distance <= obj.size / 2) {
                this._onHit.fire({ obj, depth: obj.size / 2 - distance });
            }
        }
    }
    testWall() {
        return null;
    }
}
exports.GroundHitbox = GroundHitbox;
