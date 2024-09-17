import type * as PIXI from "pixi.js";
import type { Renderable } from "./render/render";
import type { Hitbox } from "./hitbox";

import { Disposable } from "@/common/lifecycle";

import { Vector, VectorCollection } from "./vector";

interface ICanvasObject extends Renderable {
    mass: number
    velocity: Vector

    applyForce(force: Vector): void
    clearForces(): void
}

export class CanvasObject extends Disposable implements ICanvasObject {
    private _forces: VectorCollection = new VectorCollection();

    public constructor(
        protected _obj: PIXI.ContainerChild,
        public mass: number,
        public velocity: Vector,
        public hitbox: Hitbox
    ) {
        super();

        this._register(this.hitbox);
    }

    public applyForce(force: Vector) {
        this._forces.push(force);
    }

    public clearForces() {
        this._forces.clear();
    }

    protected _updateHitboxAnchor(): void {
        const bound = this._obj.getBounds();
        this.hitbox.setAnchor({
            x: bound.x,
            y: bound.y
        });
    }

    public update(delta: number, app: PIXI.Application) {
        const sumForce = this._forces.getSum();
        const accelerate = Vector.multiplyScalar(sumForce, 1 / this.mass);
        
        this.velocity = Vector.add(this.velocity, accelerate);
        this._obj.x += this.velocity.x * delta;
        this._obj.y -= this.velocity.y * delta;

        this._updateHitboxAnchor();

        app.stage.addChild(this._obj);
    }

    public override dispose() {
        this.clearForces();
        this.velocity = Vector.Zero;
        
        super.dispose();
    }
}
