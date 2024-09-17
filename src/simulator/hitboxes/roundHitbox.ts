import type { Point } from "@/simulator/render/render";
import type { CanvasObject } from "@/simulator/object";

import { Hitbox, type IHitbox } from "@/simulator/hitbox";
import { getPointDistance } from "@/common/utils/utils";

import { ConvexHitbox } from "./convexHitbox";

interface IRoundHitbox extends IHitbox {
    radius: number
}

export class RoundHitbox extends Hitbox implements IRoundHitbox {
    public constructor(public radius: number, anchor: Point) {
        super(anchor);

        if(radius <= 0) {
            throw new Error("The radius of a round hitbox must be greater than 0.");
        }
    }

    public test(obj: CanvasObject) {
        const hitbox = obj.hitbox;

        if(this._isNextTestCancelled) {
            this._isNextTestCancelled = false;
            return;
        }

        if(hitbox instanceof ConvexHitbox) {
            //
        } else if(hitbox instanceof RoundHitbox) {
            const distance = getPointDistance(this.anchor, hitbox.anchor);
            const radiusSum = this.radius + hitbox.radius;

            if(distance <= radiusSum) {
                this._onHit.fire({ obj, depth: radiusSum - distance });
            }
        }
    }
}
