import type { Point } from "@/simulator/render/render";
import type { CanvasObject } from "@/simulator/object";
import type { Canvas } from "@/ui/canvas/canvas";

import { Hitbox, type IHitbox } from "@/simulator/hitbox";
import { getPointDistance } from "@/common/utils/utils";

interface OnHitListenerData {
    depth: number
}

interface IRoundHitbox extends IHitbox<OnHitListenerData> {
    radius: number
}

export class RoundHitbox extends Hitbox<OnHitListenerData> implements IRoundHitbox {
    
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

        if(hitbox instanceof RoundHitbox) {
            const distance = getPointDistance(this.anchor, hitbox.anchor);
            const radiusSum = this.radius + hitbox.radius;

            if(distance <= radiusSum) {
                this._onHit.fire({ obj, depth: radiusSum - distance });
            }
        }
    }

    public testWall(canvas: Canvas) {
        if(this.anchor.y <= 0) {
            return "y";
        } else if(this.anchor.x <= 0 || this.anchor.x + 2 * this.radius >= canvas.width) {
            return "x";
        }

        return null;
    }
}
