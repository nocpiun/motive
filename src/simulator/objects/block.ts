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
