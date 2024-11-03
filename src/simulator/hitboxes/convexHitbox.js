"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvexHitbox = void 0;
const hitbox_1 = require("@/simulator/hitbox");
const vector_1 = require("@/simulator/vector");
const roundHitbox_1 = require("./roundHitbox");
class ConvexHitbox extends hitbox_1.Hitbox {
    constructor(boundaries, anchor) {
        super(anchor);
        this.boundaries = boundaries;
        if (new vector_1.VectorCollection(boundaries).getSum().length !== 0) {
            throw new Error("The sum of the boundary vectors must be 0.");
        }
    }
    test(obj) {
        const hitbox = obj.hitbox;
        if (this._isNextTestCancelled) {
            this._isNextTestCancelled = false;
            return;
        }
        if (hitbox instanceof ConvexHitbox) {
            return false;
        }
        else if (hitbox instanceof roundHitbox_1.RoundHitbox) {
            return false;
        }
    }
    testWall(canvas) {
        if (this.anchor.y <= 0) {
            return "y";
        }
        else if (this.anchor.x <= 0 || this.anchor.x + this.boundaries[0].x >= canvas.width) {
            return "x";
        }
        return null;
    }
}
exports.ConvexHitbox = ConvexHitbox;
