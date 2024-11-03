"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundHitbox = void 0;
const hitbox_1 = require("@/simulator/hitbox");
const utils_1 = require("@/common/utils/utils");
const convexHitbox_1 = require("./convexHitbox");
class RoundHitbox extends hitbox_1.Hitbox {
    constructor(radius, anchor) {
        super(anchor);
        this.radius = radius;
        if (radius <= 0) {
            throw new Error("The radius of a round hitbox must be greater than 0.");
        }
    }
    test(obj) {
        const hitbox = obj.hitbox;
        if (this._isNextTestCancelled) {
            this._isNextTestCancelled = false;
            return;
        }
        if (hitbox instanceof convexHitbox_1.ConvexHitbox) {
            //
        }
        else if (hitbox instanceof RoundHitbox) {
            const distance = (0, utils_1.getPointDistance)(this.anchor, hitbox.anchor);
            const radiusSum = this.radius + hitbox.radius;
            if (distance <= radiusSum) {
                this._onHit.fire({ obj, depth: radiusSum - distance });
            }
        }
    }
    testWall(canvas) {
        if (this.anchor.y <= 0) {
            return "y";
        }
        else if (this.anchor.x <= 0 || this.anchor.x + 2 * this.radius >= canvas.width) {
            return "x";
        }
        return null;
    }
}
exports.RoundHitbox = RoundHitbox;
