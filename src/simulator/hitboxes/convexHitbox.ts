import type { Point } from "@/simulator/render/render";
import type { CanvasObject } from "@/simulator/object";

import { Hitbox, type IHitbox } from "@/simulator/hitbox";
import { type Vector, VectorCollection } from "@/simulator/vector";

import { RoundHitbox } from "./roundHitbox";

interface IConvexHitbox extends IHitbox {
    boundaries: VectorCollection
}

export class ConvexHitbox extends Hitbox implements IConvexHitbox {
    public boundaries: VectorCollection;

    public constructor(boundaryVectors: Vector[], anchor: Point) {
        super(anchor);

        this.boundaries = new VectorCollection(boundaryVectors);

        if(this.boundaries.getSum().length !== 0) {
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
}
