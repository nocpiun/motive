import type * as PIXI from "pixi.js";
import type { Renderable } from "./render/render";
import type { Hitbox } from "./hitbox";

import { Disposable } from "@/common/lifecycle";

import { Vector, VectorCollection } from "./vector";

interface ICanvasObject extends Renderable {
    obj: PIXI.ContainerChild
    mass: number
    velocity: Vector

    applyForce(force: Vector): void
    applyOnceForce(force: Vector): void
    clearForces(): void
    updateHitboxAnchor(): void
}

export class CanvasObject extends Disposable implements ICanvasObject {
    private _forces: VectorCollection = new VectorCollection();
    private _onceForces: VectorCollection = new VectorCollection();

    public constructor(
        public obj: PIXI.ContainerChild,
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

    public applyOnceForce(force: Vector) {
        this._onceForces.push(force);
    }

    public clearForces() {
        this._forces.clear();
        this._onceForces.clear();
    }

    public updateHitboxAnchor(): void {
        const bound = this.obj.getBounds();
        this.hitbox.setAnchor({
            x: bound.x,
            y: bound.y
        });
    }

    public update(delta: number, app: PIXI.Application) {
        const sumForce = Vector.add(this._forces.getSum(), this._onceForces.getSum());
        const accelerate = Vector.multiplyScalar(sumForce, 1 / this.mass);
        
        this.velocity = Vector.add(this.velocity, accelerate);
        this.obj.x += this.velocity.x * delta;
        this.obj.y -= this.velocity.y * delta;

        this.updateHitboxAnchor();
        this._onceForces.clear();

        app.stage.addChild(this.obj);
    }

    public override dispose() {
        this.clearForces();
        this.velocity = Vector.Zero;
        
        super.dispose();
    }
}
