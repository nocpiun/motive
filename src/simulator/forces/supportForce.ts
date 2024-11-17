import type { Vector } from "@/simulator/vector";
import type { CanvasObject } from "@/simulator/object";

import { Force, type IForce } from "@/simulator/force";
import { Ground } from "@/simulator/objects/ground";
import { Ball } from "@/simulator/objects/ball";
import { Block } from "@/simulator/objects/block";

import { FrictionForce } from "./frictionForce";

interface ISupportForce extends IForce {
    origin: CanvasObject
    frictionForce: FrictionForce
}

export class SupportForce extends Force implements ISupportForce {
    public frictionForce: FrictionForce;
    
    private constructor(x: number, y: number, public origin: CanvasObject, private readonly _friction: number = 0) {
        super(x, y);

        this.frictionForce = FrictionForce.create(this, this._friction);
    }

    public override update(self: CanvasObject) {
        super.update(self);

        if(self instanceof Ball) {
            if(this.origin instanceof Ground && self.obj.y < self.render.canvas.height - Ground.GROUND_HEIGHT - self.radius) {
                self.forces.removeForce(this);
                // self.forces.removeForce(this.frictionForce);
            }
        } else if(self instanceof Block) {
            if(this.origin instanceof Ground && self.obj.y < self.render.canvas.height - Ground.GROUND_HEIGHT - self.size) {
                self.forces.removeForce(this);
                // self.forces.removeForce(this.frictionForce);
            }
        }
    }
    
    public static override from(vector: Force | Vector, origin?: CanvasObject, friction?: number): SupportForce {
        if(!origin) throw new Error("Cannot create a support force without providing the origin object.");

        return new SupportForce(vector.x, vector.y, origin, friction);
    }
}
