import * as PIXI from "pixi.js";

import { CanvasObject } from "@/simulator/object";
import { colors } from "@/simulator/render/colors";
import { Vector } from "@/simulator/vector";

export class Ball extends CanvasObject {
    public constructor() {
        super(
            new PIXI.Graphics()
                .arc(100, 100, 15, 0, 2 * Math.PI)
                .fill(colors["black"]),
            1,
            new Vector(0, 0)
        );

        this.applyForce(new Vector(0, -2));
    }

    public update(delta: number, app: PIXI.Application) {
        super.update(delta, app);
    }
}
