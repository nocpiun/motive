import * as PIXI from "pixi.js";

import { CanvasObject, registerObject } from "@/simulator/object";
import { colors } from "@/simulator/render/colors";
import { Vector } from "@/simulator/vector";
import { GroundHitbox } from "@/simulator/hitboxes/groundHitbox";
import { Force } from "@/simulator/force";

import { Ball } from "./ball";
import { Block } from "./block";

export class Ground extends CanvasObject<GroundHitbox> {
    public static readonly GROUND_HEIGHT = 50;
    public static readonly DAMPING = .9;
    public static readonly STABLE_VELOCITY = 23;

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
                // To prevent the object from going through the ground
                obj.obj.y = this.hitbox.anchor.y - obj.radius;
                obj.updateHitboxAnchor();

                const vy = obj.velocity.getComponent(this.normalVector);
                const vx = Vector.sub(obj.velocity, vy);

                if(vy.length > Ground.STABLE_VELOCITY) {
                    obj.velocity = Vector.add(vx, Vector.multiplyScalar(Vector.reverse(vy), Ground.DAMPING));
                } else {
                    obj.velocity = vx;
                    obj.applyForce("ground.support", Force.reverse(Force.gravity(obj.mass)));
                }
            } else if(obj instanceof Block) {
                // To prevent the object from going through the ground
                obj.obj.y = this.hitbox.anchor.y - obj.size;
                obj.updateHitboxAnchor();

                obj.velocity.y = 0;
                obj.applyForce("ground.support", Force.reverse(Force.gravity(obj.mass)));
            }
        }));
    }

    public override update(delta: number, container: PIXI.Container) {
        super.update(delta, container);
    }
}

registerObject("ground", Ground);
