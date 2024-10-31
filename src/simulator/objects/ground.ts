import type { Render } from "@/simulator/render/render";

import * as PIXI from "pixi.js";

import { CanvasObject, registerObject } from "@/simulator/object";
import { colors } from "@/simulator/render/colors";
import { Vector } from "@/simulator/vector";
import { GroundHitbox } from "@/simulator/hitboxes/groundHitbox";
import { Force } from "@/simulator/force";

import { Ball } from "./ball";
import { Block } from "./block";

export class Ground extends CanvasObject<GroundHitbox> {
    public static readonly id = "ground";

    public static readonly GROUND_HEIGHT = 50;
    public static readonly DAMPING = 1;
    public static readonly STABLE_VELOCITY = 5;

    public readonly normalVector: Vector = new Vector(0, 1);

    public constructor(render: Render) {
        super(
            render,

            new PIXI.Graphics(), // to be painted in _initTexture()
            Infinity,
            Vector.Zero,
            new GroundHitbox({ x: 0, y: render.canvas.height - Ground.GROUND_HEIGHT })
        );

        // Ground texture
        this._initTexture();

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
                    obj.velocity.y = 0;
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

    private _initTexture(): void {
        const canvasWidth = this.render.canvas.width;
        const canvasHeight = this.render.canvas.height;

        const spacing = 10;
        const lineWidth = 2;
        const length = 13;
        const angle = Math.PI / 4;
        const y = canvasHeight - Ground.GROUND_HEIGHT;
        const obj = this.obj as PIXI.Graphics;

        // Horizontal line
        obj.moveTo(0, canvasHeight - Ground.GROUND_HEIGHT)
            .lineTo(canvasWidth, canvasHeight - Ground.GROUND_HEIGHT)
            .stroke({ width: 4, color: colors["black"] });
        
        // Texture lines
        for(let x = 0; x <= canvasWidth; x += spacing) {
            obj.moveTo(x, y)
            .lineTo(x - length * Math.sin(angle), y + length * Math.cos(angle))
            .stroke({ width: lineWidth, color: colors["black"] });
        }
    }

    public override update(delta: number) {
        super.update(delta);
    }
}

registerObject(Ground.id, Ground);
