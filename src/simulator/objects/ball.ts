import type { Render } from "@/simulator/render/render";

import * as PIXI from "pixi.js";

import { CanvasObject, registerObject } from "@/simulator/object";
import { colors } from "@/simulator/render/colors";
import { Vector } from "@/simulator/vector";
import { RoundHitbox } from "@/simulator/hitboxes/roundHitbox";
import { $ } from "@/common/i18n";

export class Ball extends CanvasObject<RoundHitbox> {
    public static readonly id = "ball";

    public constructor(
        render: Render,

        x: number,
        y: number,
        public radius: number = 15,
        mass: number = 1,
        velocity: Vector = Vector.Zero
    ) {
        super(
            render,

            new PIXI.Graphics()
                .circle(0, 0, radius)
                .fill(colors["black"]),
            mass,
            velocity,
            new RoundHitbox(radius, { x, y })
        );

        this.obj.position.set(x, y);

        this._enableInteractivity();
        this._enableSettings(Ball.id, () => ({
            name: {
                name: $("modal.object.ball.name"),
                value: this.name,
                controlOptions: {
                    type: "text",
                    maxLength: 1
                }
            },
            mass: {
                name: $("modal.object.ball.mass"),
                value: this.mass,
                controlOptions: {
                    type: "number",
                    minValue: 0
                }
            }
        }));
        this.applyGravity();

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

                /** *m1 + m2* */
                const massSum = this.mass + obj.mass;
                /** *m1 - m2* */
                const massDiff = this.mass - obj.mass;

                const vx1 = this.velocity.getComponent(new Vector(1, 0));
                const vy1 = this.velocity.getComponent(new Vector(0, 1));
                const vx2 = obj.velocity.getComponent(new Vector(1, 0));
                const vy2 = obj.velocity.getComponent(new Vector(0, 1));

                // X direction
    
                /** *((m2 - m1) v2) / (m1 + m2)* */
                const vxa = Vector.multiplyScalar(vx2, -massDiff / massSum);
                /** *(2 m1 v1) / (m1 + m2)* */
                const vxb = Vector.multiplyScalar(vx1, (2 * this.mass) / massSum);
                /** *((m1 - m2) v1) / (m1 + m2)* */
                const vxc = Vector.multiplyScalar(vx1, massDiff / massSum);
                /** *(2 m2 v2) / (m1 + m2)* */
                const vxd = Vector.multiplyScalar(vx2, (2 * obj.mass) / massSum);

                // Y direction

                /** *((m2 - m1) v2) / (m1 + m2)* */
                const vya = Vector.multiplyScalar(vy2, -massDiff / massSum);
                /** *(2 m1 v1) / (m1 + m2)* */
                const vyb = Vector.multiplyScalar(vy1, (2 * this.mass) / massSum);
                /** *((m1 - m2) v1) / (m1 + m2)* */
                const vyc = Vector.multiplyScalar(vy1, massDiff / massSum);
                /** *(2 m2 v2) / (m1 + m2)* */
                const vyd = Vector.multiplyScalar(vy2, (2 * obj.mass) / massSum);
    
                obj.velocity = Vector.add(Vector.add(vxa, vxb), Vector.add(vya, vyb)); // v2'
                this.velocity = Vector.add(Vector.add(vxc, vxd), Vector.add(vyc, vyd)); // v1'
            }
        }));

        this._register(this.onPointerUp(({ velocity }) => {
            this.velocity = velocity;
        }));

        this._register(this.onSettingsSave((settings) => {
            this.setName(settings["name"].value);
            this.setMass(settings["mass"].value);
        }));
    }

    public override update(delta: number) {
        super.update(delta);

        this._drawName(0, 0);
    }
}

registerObject(Ball.id, Ball);
