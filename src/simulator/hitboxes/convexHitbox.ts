import type { Point } from "@/simulator/render/render";
import type { CanvasObject } from "@/simulator/object";
import type { Canvas } from "@/ui/canvas/canvas";

import { Hitbox, type IHitbox } from "@/simulator/hitbox";

import { RoundHitbox } from "./roundHitbox";

interface OnHitListenerData {
    overlayX: number
    overlayY: number
}

interface IConvexHitbox extends IHitbox<OnHitListenerData> {
    width: number
    height: number
}

export class ConvexHitbox extends Hitbox<OnHitListenerData> implements IConvexHitbox {
    
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
                this._onHit.fire({
                    obj,
                    overlayX: (
                        this.anchor.x === hitbox.anchor.x
                        ? 0
                        : (
                            this.anchor.x > hitbox.anchor.x
                            ? -(hitbox.width - this.anchor.x + hitbox.anchor.x)
                            : this.width - hitbox.anchor.x + this.anchor.x
                        )
                    ),
                    overlayY: (
                        this.anchor.y === hitbox.anchor.y
                        ? 0
                        : (
                            this.anchor.y > hitbox.anchor.y
                            ? -(hitbox.height - this.anchor.y + hitbox.anchor.y)
                            : this.height - hitbox.anchor.y + this.anchor.y
                        )
                    )
                });
            }
        } else if(hitbox instanceof RoundHitbox) {
            const diameter = 2 * hitbox.radius;

            if(
                hitbox.anchor.x > this.anchor.x - diameter &&
                hitbox.anchor.x < this.anchor.x + this.width &&
                hitbox.anchor.y > this.anchor.y - diameter &&
                hitbox.anchor.y < this.anchor.y + this.height
            ) {
                this._onHit.fire({
                    obj,
                    overlayX: (
                        this.anchor.x === hitbox.anchor.x
                        ? 0
                        : (
                            this.anchor.x > hitbox.anchor.x
                            ? -(diameter - this.anchor.x + hitbox.anchor.x)
                            : this.width - hitbox.anchor.x + this.anchor.x
                        )
                    ),
                    overlayY: (
                        this.anchor.y === hitbox.anchor.y
                        ? 0
                        : (
                            this.anchor.y > hitbox.anchor.y
                            ? -(diameter - this.anchor.y + hitbox.anchor.y)
                            : this.height - hitbox.anchor.y + this.anchor.y
                        )
                    )
                });
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
