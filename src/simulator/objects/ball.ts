import * as PIXI from "pixi.js";

import { CanvasObject } from "@/simulator/object";
import { colors } from "@/simulator/render/colors";
import { Vector } from "@/simulator/vector";
import { RoundHitbox } from "@/simulator/hitboxes/roundHitbox";
import { Force } from "@/simulator/force";

export class Ball extends CanvasObject<RoundHitbox> {
    public constructor(
        x: number,
        y: number,
        radius: number = 15,
        mass: number = 1,
        velocity: Vector = Vector.Zero
    ) {
        super(
            new PIXI.Graphics()
                .circle(0, 0, radius)
                .fill(colors["black"]),
            mass,
            velocity,

            new RoundHitbox(radius, { x, y })
        );

        this.obj.position.set(x, y);

        this.applyForce(Force.gravity(mass));

        this._register(this.hitbox.onHit(({ obj, depth }) => {
            if(obj instanceof Ball) {
                obj.hitbox.cancelNextTest();

                /**
                 * To prevent balls from going through each other
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

                const massSum = this.mass + obj.mass;
                const massDiff = this.mass - obj.mass;
    
                const va = Vector.multiplyScalar(obj.velocity, -massDiff / massSum);
                const vb = Vector.multiplyScalar(this.velocity, (2 * this.mass) / massSum);
                const vc = Vector.multiplyScalar(this.velocity, massDiff / massSum);
                const vd = Vector.multiplyScalar(obj.velocity, (2 * obj.mass) / massSum);
    
                obj.velocity = Vector.add(va, vb);
                this.velocity = Vector.add(vc, vd);
            }
        }));
    }

    public override update(delta: number, container: PIXI.Container) {
        super.update(delta, container);
    }
}