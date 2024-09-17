// import type { RoundHitbox } from "@/simulator/hitboxes/roundHitbox";

import * as PIXI from "pixi.js";

import { CanvasObject } from "@/simulator/object";
import { colors } from "@/simulator/render/colors";
import { Vector } from "@/simulator/vector";
import { GroundHitbox } from "@/simulator/hitboxes/groundHitbox";
// import { gravity as g } from "@/common/global";

import { Ball } from "./ball";

export class Ground extends CanvasObject {
    public static readonly GROUND_HEIGHT = 50;

    public constructor(canvas: HTMLCanvasElement) {
        super(
            new PIXI.Graphics()
                .rect(0, canvas.height - Ground.GROUND_HEIGHT, canvas.width, Ground.GROUND_HEIGHT)
                .fill(colors["black"]),
            Infinity,
            Vector.Zero,

            new GroundHitbox({ x: 0, y: canvas.height - Ground.GROUND_HEIGHT })
        );

        this._register(this.hitbox.onHit(({ obj, depth }) => {
            if(obj instanceof Ball) {
                this.hitbox.cancelNextTest();

                // To prevent the object from going through the ground
                obj.obj.y -= depth;
                obj.updateHitboxAnchor();
    
                // Apply a force to the object
                // const forceSize = obj.mass * g + 2 * obj.mass * obj.velocity.y / .01;
                // obj.applyOnceForce(new Vector(0, forceSize));

                obj.velocity = Vector.reverse(obj.velocity);

                // obj.velocity = Vector.multiplyScalar(Vector.reverse(obj.velocity), .7);
                // if(obj.velocity.length < 15) {
                //     obj.velocity = Vector.Zero;
                //     obj.clearForces();
                // }
            }
        }));
    }

    public update(delta: number, app: PIXI.Application) {
        super.update(delta, app);
    }
}
