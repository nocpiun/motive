import type * as PIXI from "pixi.js";
import type { Renderable } from "./render/render";
import type { Hitbox } from "./hitbox";

import { Disposable } from "@/common/lifecycle";

import { Vector, VectorCollection } from "./vector";
import { Force } from "./force";

interface ICanvasObject extends Renderable {
    obj: PIXI.ContainerChild
    mass: number
    velocity: Vector

    applyForce(force: Force): void
    applyOnceForce(force: Force): void
    clearForces(): void
    updateHitboxAnchor(): void
}

export class CanvasObject<H extends Hitbox = Hitbox> extends Disposable implements ICanvasObject {
    private _forces: VectorCollection = new VectorCollection();
    private _onceForces: VectorCollection = new VectorCollection();

    public constructor(
        public obj: PIXI.ContainerChild,
        public mass: number,
        public velocity: Vector,
        public hitbox: H
    ) {
        super();

        this._register(this.hitbox);
    }

    public applyForce(force: Force) {
        this._forces.push(force);
    }

    public applyOnceForce(force: Force) {
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

    public update(delta: number, container: PIXI.Container) {
        const sumForce = Force.add(this._forces.getSum(), this._onceForces.getSum());
        const accelerate = sumForce.getAccelerate(this.mass);
        
        this.velocity = Vector.add(this.velocity, accelerate);
        this.obj.x += this.velocity.x * delta;
        this.obj.y -= this.velocity.y * delta;

        this.updateHitboxAnchor();
        this._onceForces.clear();

        container.addChild(this.obj);
    }

    public override dispose() {
        this.clearForces();
        this.velocity = Vector.Zero;
        this.obj.destroy();
        
        super.dispose();
    }
}
