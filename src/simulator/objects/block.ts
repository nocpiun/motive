import type { Render } from "@/simulator/render/render";

import * as PIXI from "pixi.js";

import { CanvasObject, registerObject } from "@/simulator/object";
import { colors } from "@/simulator/render/colors";
import { Vector } from "@/simulator/vector";
import { ConvexHitbox } from "@/simulator/hitboxes/convexHitbox";

import { Ground } from "./ground";
import { Ball } from "./ball";

export class Block extends CanvasObject<ConvexHitbox> {
    public static readonly id = "block";

    public constructor(
        render: Render,

        x: number,
        y: number,
        public size: number = 30,
        mass: number = 1,
        velocity: Vector = Vector.Zero
    ) {
        super(
            render,
            
            new PIXI.Graphics()
                .rect(0, 0, size, size)
                .fill(colors["wood"]),
            mass,
            velocity,
            new ConvexHitbox(size, size, { x: x - size / 2, y: y - size / 2 })
        );

        this.obj.position.set(x, y);

        this._enableInteractivity();
        this._enableSettings(Ball.id, () => ({
            name: {
                name: "名称",
                value: this._name,
                controlOptions: {
                    type: "text",
                    maxLength: 1
                }
            },
            mass: {
                name: "质量",
                value: this.mass,
                controlOptions: {
                    type: "number"
                }
            }
        }));
        this.applyGravity();

        this._register(this.hitbox.onHit(({ obj, overlayX, overlayY }) => {
            if(obj instanceof Block || obj instanceof Ball) {
                obj.hitbox.cancelNextTest();

                /**
                 * To prevent objects from going through each other
                 */

                // Test which side the hit happens (left right side / top side)
                if(Math.abs(overlayX) < Math.abs(overlayY) && overlayX !== 0) {
                    this.obj.x -= overlayX / 2;
                    obj.obj.x += overlayX / 2;
                } else {
                    this.obj.y -= overlayY / 2;
                    obj.obj.y += overlayY / 2;
                }

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

        if(this.obj.y < this.render.canvas.height - Ground.GROUND_HEIGHT - this.size) {
            this.removeForce("ground.support");
        }

        this._drawName(this.size / 2, this.size / 2);
    }
}

registerObject(Block.id, Block);
