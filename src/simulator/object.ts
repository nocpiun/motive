import type * as PIXI from "pixi.js";
import type { Renderable } from "./render/render";
import type { Hitbox } from "./hitbox";
import type { Ground } from "./objects/ground";
import type { Ball } from "./objects/ball";
import type { Block } from "./objects/block";

import { Disposable } from "@/common/lifecycle";
import { generateRandomID } from "@/common/utils/utils";

import { ForceCollection, Vector } from "./vector";
import { Force } from "./force";

interface ICanvasObject extends Renderable {
    obj: PIXI.ContainerChild
    mass: number
    velocity: Vector

    /**
     * Apply a force to the object
     * 
     * @param force The force to apply
     */
    applyForce(key: string, force: Force): void
    /**
     * Apply a one-time force to the object
     * 
     * @param force The force to apply
     */
    applyOnceForce(force: Force): void
    /**
     * Apply the gravity to the object
     * 
     * *G = mg*
     */
    applyGravity(): void
    /**
     * Remove a specified force from the object
     * 
     * If the given key doesn't exist, do nothing.
     * 
     * @param key The key of the force
     */
    removeForce(key: string): void
    /**
     * Clear all forces from the object
     */
    clearForces(): void
    /**
     * Update the anchor point of the hitbox,
     * so that it matches the current position of the object.
     */
    updateHitboxAnchor(): void
}

export class CanvasObject<H extends Hitbox = Hitbox> extends Disposable implements ICanvasObject {
    private _forces: ForceCollection = new ForceCollection();
    private _onceForces: ForceCollection = new ForceCollection();

    public constructor(
        public obj: PIXI.ContainerChild,
        public mass: number,
        public velocity: Vector,
        public hitbox: H
    ) {
        super();

        this._register(this.hitbox);
    }

    public applyForce(key: string, force: Force) {
        this._forces.add(key, force);
    }

    public applyOnceForce(force: Force) {
        this._onceForces.add(generateRandomID(), force);
    }

    public applyGravity() {
        this._forces.add("gravity", Force.gravity(this.mass));
    }

    public removeForce(key: string) {
        this._forces.remove(key);
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

export interface ObjectNameMap {
    "ground": Ground
    "ball": Ball
    "block": Block
    "board": any
    "rope": any
}

const objMap = new Map<string, any>();

export function registerObject(id: string, obj: any): void {
    objMap.set(id, obj);
}

export function createObject<T extends keyof ObjectNameMap>(id: string, ...args: any[]): ObjectNameMap[T] {
    const objClass = objMap.get(id);

    return new objClass(...args);
}
