import type { Point } from "@/simulator/render/render";
import type { CanvasObject } from "@/simulator/object";
import type { Canvas } from "@/ui/canvas/canvas";

import { Hitbox, type IHitbox } from "@/simulator/hitbox";

import { RoundHitbox } from "./roundHitbox";

interface IConvexHitbox extends IHitbox {
    width: number
    height: number
}

export class ConvexHitbox extends Hitbox implements IConvexHitbox {
    
    public constructor(
        public width: number,
        public height: number,
        anchor: Point
    ) {
        super(anchor);
    }

    public test(obj: CanvasObject) {
        const hitbox = obj.hitbox;

        if(this._isNextTestCancelled) {
            this._isNextTestCancelled = false;
            return;
        }

        if(hitbox instanceof ConvexHitbox) {
            if(
                this.anchor.x > hitbox.anchor.x - this.width &&
                this.anchor.x < hitbox.anchor.x + hitbox.width &&
                this.anchor.y > hitbox.anchor.y - this.height &&
                this.anchor.y < hitbox.anchor.y + hitbox.height
            ) {
                this._onHit.fire({ obj, depth: 0 });
            }
        } else if(hitbox instanceof RoundHitbox) {
            const diameter = 2 * hitbox.radius;

            if(
                hitbox.anchor.x > this.anchor.x - diameter &&
                hitbox.anchor.x < this.anchor.x + this.width &&
                hitbox.anchor.y > this.anchor.y - diameter &&
                hitbox.anchor.y < this.anchor.y + this.height
            ) {
                this._onHit.fire({ obj, depth: 0 });
            }
        }
    }

    public testWall(canvas: Canvas) {
        if(this.anchor.y <= 0) {
            return "y";
        } else if(this.anchor.x <= 0 || this.anchor.x + this.width >= canvas.width) {
            return "x";
        }

        return null;
    }
}
