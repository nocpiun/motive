import type { Point } from "@/simulator/render/render";
import type { CanvasObject } from "@/simulator/object";

import { Hitbox, type IHitbox } from "@/simulator/hitbox";

import { RoundHitbox } from "./roundHitbox";

interface IGroundHitbox extends IHitbox {
    
}

export class GroundHitbox extends Hitbox implements IGroundHitbox {
    public constructor(anchor: Point) { // anchor = (0, canvas.height - GROUND_HEIGHT)
        super(anchor);
    }

    public test(obj: CanvasObject) {
        const hitbox = obj.hitbox;

        if(this._isNextTestCancelled) {
            this._isNextTestCancelled = false;
            return;
        }

        if(hitbox instanceof RoundHitbox) {
            const distance = this.anchor.y - hitbox.anchor.y;

            if(this.anchor.y - hitbox.anchor.y <= hitbox.radius) {
                this._onHit.fire({ obj, depth: hitbox.radius - distance });
            }
        }
    }
}
