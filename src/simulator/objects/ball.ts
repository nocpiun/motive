import * as PIXI from "pixi.js";

import { CanvasObject } from "@/simulator/object";
import { colors } from "@/simulator/render/colors";
import { Vector } from "@/simulator/vector";
import { RoundHitbox } from "@/simulator/hitboxes/roundHitbox";

export class Ball extends CanvasObject {
    public constructor(
        x: number,
        y: number,
        radius: number = 15,
        mass: number = 1,
        velocity: Vector = Vector.Zero
    ) {
        super(
            new PIXI.Graphics()
                .arc(x, y, radius, 0, 2 * Math.PI)
                .fill(colors["black"]),
            mass,
            velocity,

            new RoundHitbox(radius, { x, y })
        );

        // Fake gravity
        // this.applyForce(new Vector(0, -2));

        this._register(this.hitbox.onHit((obj) => {
            obj.hitbox.cancelNextTest();

            const massSum = this.mass + obj.mass;
            const massDiff = this.mass - obj.mass;

            const va = Vector.multiplyScalar(obj.velocity, -massDiff / massSum);
            const vb = Vector.multiplyScalar(this.velocity, (2 * this.mass) / massSum);
            const vc = Vector.multiplyScalar(this.velocity, massDiff / massSum);
            const vd = Vector.multiplyScalar(obj.velocity, (2 * obj.mass) / massSum);

            obj.velocity = Vector.add(va, vb);
            this.velocity = Vector.add(vc, vd);
        }));
    }

    public update(delta: number, app: PIXI.Application) {
        super.update(delta, app);
    }
}
