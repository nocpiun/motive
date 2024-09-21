import * as PIXI from "pixi.js";

import { CanvasObject } from "@/simulator/object";
import { colors } from "@/simulator/render/colors";
import { Vector } from "@/simulator/vector";
import { GroundHitbox } from "@/simulator/hitboxes/groundHitbox";
import { Force } from "@/simulator/force";

import { Ball } from "./ball";

export class Ground extends CanvasObject<GroundHitbox> {
    public static readonly GROUND_HEIGHT = 50;

    public readonly normalVector: Vector = new Vector(0, 1);

    public constructor(canvas: HTMLCanvasElement) {
        super(
            new PIXI.Graphics()
                .rect(0, 0, canvas.width, Ground.GROUND_HEIGHT)
                .fill(colors["black"]),
            Infinity,
            Vector.Zero,

            new GroundHitbox({ x: 0, y: canvas.height - Ground.GROUND_HEIGHT })
        );

        this.obj.position.set(0, canvas.height - Ground.GROUND_HEIGHT);

        this._register(this.hitbox.onHit(({ obj }) => {
            if(obj instanceof Ball) {
                this.hitbox.cancelNextTest();

                // To prevent the object from going through the ground
                obj.obj.y = this.hitbox.anchor.y - obj.hitbox.radius;
                obj.updateHitboxAnchor();

                const vy = obj.velocity.getComponent(this.normalVector);
                const vx = Vector.sub(obj.velocity, vy);

                if(vy.length > 2) {
                    obj.velocity = Vector.add(vx, Vector.reverse(vy));
                } else {
                    obj.velocity = vx;
                    obj.applyForce(Force.reverse(Force.gravity(obj.mass)));
                }
            }
        }));
    }

    public override update(delta: number, container: PIXI.Container) {
        super.update(delta, container);
    }
}
