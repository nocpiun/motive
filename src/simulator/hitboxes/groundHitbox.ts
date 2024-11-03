import type { Point } from "@/simulator/render/render";
import type { CanvasObject } from "@/simulator/object";

import { Hitbox, type IHitbox } from "@/simulator/hitbox";
import { Block } from "@/simulator/objects/block";

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

            if(distance <= hitbox.radius * 2) {
                this._onHit.fire({ obj, depth: hitbox.radius - distance });
            }
        } else if(obj instanceof Block) { // special type of ConvexHitbox
            const distance = this.anchor.y - obj.hitbox.anchor.y - obj.size / 2;

            if(distance <= obj.size / 2) {
                this._onHit.fire({ obj, depth: obj.size / 2 - distance });
            }
        }
    }

    public testWall(): null {
        return null;
    }
}
