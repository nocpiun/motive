import type { Vector } from "@/simulator/vector";
import type { CanvasObject } from "@/simulator/object";

import { Force, type IForce } from "@/simulator/force";
import { Ground } from "@/simulator/objects/ground";
import { Ball } from "@/simulator/objects/ball";
import { Block } from "@/simulator/objects/block";

interface ISupportForce extends IForce {
    origin: CanvasObject
}

export class SupportForce extends Force implements ISupportForce {
    
    private constructor(x: number, y: number, public origin: CanvasObject) {
        super(x, y);
    }

    public override update(self: CanvasObject) {
        super.update(self);

        if(self instanceof Ball) {
            if(this.origin instanceof Ground && self.obj.y < self.render.canvas.height - Ground.GROUND_HEIGHT - self.radius) {
                self.forces.removeForce(this);
            }
        } else if(self instanceof Block) {
            if(this.origin instanceof Ground && self.obj.y < self.render.canvas.height - Ground.GROUND_HEIGHT - self.size) {
                self.forces.removeForce(this);
            }
        }
    }
    
    public static override from(vector: Force | Vector, origin?: CanvasObject): SupportForce {
        if(!origin) throw new Error("Cannot create a support force without providing the origin object.");

        return new SupportForce(vector.x, vector.y, origin);
    }
}
