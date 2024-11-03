import type { Point } from "@/simulator/render/render";
import type { CanvasObject } from "@/simulator/object";
import type { Canvas } from "@/ui/canvas/canvas";

import { Hitbox, type IHitbox } from "@/simulator/hitbox";
import { type Vector, VectorCollection } from "@/simulator/vector";

import { RoundHitbox } from "./roundHitbox";

interface IConvexHitbox extends IHitbox {
    boundaries: Vector[]
}

export class ConvexHitbox extends Hitbox implements IConvexHitbox {
    
    public constructor(public boundaries: Vector[], anchor: Point) {
        super(anchor);

        if(new VectorCollection(boundaries).getSum().length !== 0) {
            throw new Error("The sum of the boundary vectors must be 0.");
        }
    }

    public test(obj: CanvasObject) {
        const hitbox = obj.hitbox;

        if(this._isNextTestCancelled) {
            this._isNextTestCancelled = false;
            return;
        }

        if(hitbox instanceof ConvexHitbox) {
            return false;
        } else if(hitbox instanceof RoundHitbox) {
            return false;
        }
    }

    public testWall(canvas: Canvas) {
        if(this.anchor.y <= 0) {
            return "y";
        } else if(this.anchor.x <= 0 || this.anchor.x + this.boundaries[0].x >= canvas.width) {
            return "x";
        }

        return null;
    }
}
