import * as PIXI from "pixi.js";

import { CanvasObject } from "@/simulator/object";
import { colors } from "@/simulator/render/colors";
import { Vector } from "@/simulator/vector";
import { ConvexHitbox } from "@/simulator/hitboxes/convexHitbox";

export class Ground extends CanvasObject {
    public static readonly GROUND_HEIGHT = 50;

    public constructor(canvas: HTMLCanvasElement) {
        super(
            new PIXI.Graphics()
                .rect(0, canvas.height - Ground.GROUND_HEIGHT, canvas.width, Ground.GROUND_HEIGHT)
                .fill(colors["black"]),
            Infinity,
            Vector.Zero,

            new ConvexHitbox([
                new Vector(canvas.width, 0),
                new Vector(0, -Ground.GROUND_HEIGHT),
                new Vector(-canvas.width, 0),
                new Vector(0, Ground.GROUND_HEIGHT),
            ], { x: 0, y: canvas.height - Ground.GROUND_HEIGHT })
        );

        this._register(this.hitbox.onHit((obj) => {
            
        }));
    }

    public update(delta: number, app: PIXI.Application) {
        super.update(delta, app);
    }
}
