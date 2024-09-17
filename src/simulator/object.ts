import type { Renderable } from "./render/render";
import type * as PIXI from "pixi.js";

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
        public velocity: Vector
    ) {
        super();
    }

    public applyForce(force: Vector) {
        this._forces.push(force);
    }

    public clearForces() {
        this._forces.clear();
    }

    public update(delta: number, app: PIXI.Application) {
        const sumForce = this._forces.getSum();
        const accelerate = Vector.multiplyScalar(sumForce, 1 / this.mass);

        this.velocity = Vector.add(this.velocity, accelerate);
        this._obj.x += this.velocity.x * delta;
        this._obj.y -= this.velocity.y * delta;

        app.stage.addChild(this._obj);
    }
}
