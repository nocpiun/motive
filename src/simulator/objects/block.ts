import * as PIXI from "pixi.js";

import { CanvasObject, registerObject } from "@/simulator/object";
import { colors } from "@/simulator/render/colors";
import { Vector } from "@/simulator/vector";
import { ConvexHitbox } from "@/simulator/hitboxes/convexHitbox";

import { Ground } from "./ground";
import { Ball } from "./ball";

export class Block extends CanvasObject<ConvexHitbox> {
    public constructor(
        x: number,
        y: number,
        public size: number = 30,
        mass: number = 1,
        velocity: Vector = Vector.Zero
    ) {
        super(
            new PIXI.Graphics()
                .rect(0, 0, size, size)
                .fill(colors["wood"]),
            mass,
            velocity,

            new ConvexHitbox([
                new Vector(size, 0),
                new Vector(0, -size),
                new Vector(-size, 0),
                new Vector(0, size),
            ], { x: x - size / 2, y: y - size / 2 })
        );

        this.obj.position.set(x, y);

        this._enableInteractivity();
        this.applyGravity();

        this._register(this.hitbox.onHit(({ obj, depth }) => {
            if(obj instanceof Block || obj instanceof Ball) {
                obj.hitbox.cancelNextTest();

                /**
                 * To prevent objects from going through each other
                 */

                const p1 = this.hitbox.anchor;
                const p2 = obj.hitbox.anchor;
                const movement = Vector.multiplyScalar(Vector.fromPoints(p1, p2).getUnitVector(), depth);
                
                this.obj.x -= movement.x / 2;
                this.obj.y -= movement.y / 2;
                obj.obj.x += movement.x / 2;
                obj.obj.y += movement.y / 2;

                this.updateHitboxAnchor();
                obj.updateHitboxAnchor();

                /**
                 * Calculate new velocities (elastic collision)
                 * 
                 * v1' = ((m1 - m2) * v1) / (m1 + m2) + (2 * m2 * v2) / (m1 + m2)
                 * v2' = ((m2 - m1) * v2) / (m1 + m2) + (2 * m1 * v1) / (m1 + m2)
                 */

                /** *m1 + m2* */
                const massSum = this.mass + obj.mass;
                /** *m1 - m2* */
                const massDiff = this.mass - obj.mass;
    
                /** *((m2 - m1) v2) / (m1 + m2)* */
                const va = Vector.multiplyScalar(obj.velocity, -massDiff / massSum);
                /** *(2 m1 v1) / (m1 + m2)* */
                const vb = Vector.multiplyScalar(this.velocity, (2 * this.mass) / massSum);
                /** *((m1 - m2) v1) / (m1 + m2)* */
                const vc = Vector.multiplyScalar(this.velocity, massDiff / massSum);
                /** *(2 m2 v2) / (m1 + m2)* */
                const vd = Vector.multiplyScalar(obj.velocity, (2 * obj.mass) / massSum);
    
                obj.velocity = Vector.add(va, vb); // v2'
                this.velocity = Vector.add(vc, vd); // v1'
            }
        }));
    }

    public override update(delta: number, container: PIXI.Container) {
        super.update(delta, container);

        /** @todo */
        // Something is wrong here.
        if(this.obj.y < Ground.GROUND_HEIGHT - this.size / 2) {
            this.removeForce("ground.support");
        }
    }
}

registerObject("block", Block);
