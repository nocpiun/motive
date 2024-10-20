import type * as PIXI from "pixi.js";
import type { Point, Render, Renderable } from "./render/render";
import type { Hitbox } from "./hitbox";
import type { Ground } from "./objects/ground";
import type { Ball } from "./objects/ball";
import type { Block } from "./objects/block";

import { Emitter, type Event } from "@/common/event";
import { Disposable } from "@/common/lifecycle";
import { generateRandomID } from "@/common/utils/utils";

import { ForceCollection, Vector } from "./vector";
import { Force } from "./force";
import { colors } from "./render/colors";

interface ICanvasObject extends Renderable {
    obj: PIXI.ContainerChild
    mass: number
    velocity: Vector

    setName(name: string): void
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

    onPointerDown: Event<PIXI.FederatedPointerEvent>
    onPointerMove: Event<PointerEvent>
    onPointerUp: Event<PointerEvent>
}

export class CanvasObject<H extends Hitbox = Hitbox> extends Disposable implements ICanvasObject {
    // events
    private _onPointerDown = new Emitter<PIXI.FederatedPointerEvent>();
    private _onPointerMove = new Emitter<PointerEvent>();
    private _onPointerUp = new Emitter<PointerEvent & { velocity: Vector }>();
    
    protected _name?: string;

    private _forces: ForceCollection = new ForceCollection();
    private _onceForces: ForceCollection = new ForceCollection();

    private _isInteractive: boolean = false;
    private _isHeld: boolean = false;
    private _mousePoint: Point | null = null;
    private _mouseMovingTime: number | null = null;
    private _mouseVelocity: Vector | null = null;

    public constructor(
        protected _render: Render,
        public obj: PIXI.ContainerChild,
        public mass: number,
        public velocity: Vector,
        public hitbox: H
    ) {
        super();

        this._register(this.hitbox);
    }

    protected _enableInteractivity(): void {
        this.obj.interactive = true;
        this._isInteractive = true;

        this.obj.addEventListener("pointerdown", (e) => {
            if(!this._render.isMouseMode) return;

            if(!this._isHeld) {
                this._isHeld = true;

                this.velocity = Vector.Zero;
                this.obj.x = e.clientX;
                this.obj.y = e.clientY;
                this.updateHitboxAnchor();
            }

            this._onPointerDown.fire(e);
        });

        document.body.addEventListener("pointermove", (e) => {
            if(!this._isHeld) return;

            const x = e.clientX, y = e.clientY;

            // Update position
            this.obj.x = x;
            this.obj.y = y;
            this.updateHitboxAnchor();
            
            this._onPointerMove.fire(e);

            // Calculate velocity
            if(!this._mousePoint) this._mousePoint = { x, y };
            if(!this._mouseMovingTime) this._mouseMovingTime = Date.now();
            this._mouseVelocity = Vector.multiplyScalar(
                new Vector(this._mousePoint.x - x, y - this._mousePoint.y),
                10 / (this._mouseMovingTime - Date.now())
            );
            
            // Record mouse data
            this._mousePoint = { x, y };
            this._mouseMovingTime = Date.now();
        });
        
        document.body.addEventListener("pointerup", (e) => {
            if(!this._isHeld) return;

            this._isHeld = false;
            this._onPointerUp.fire({
                ...e,
                velocity: this._mouseVelocity ?? Vector.Zero
            });

            this._mousePoint = null;
            this._mouseMovingTime = null;
            this._mouseVelocity = null;
        });
    }

    public setName(name: string) {
        this._name = name;
    }

    protected _drawName(x: number, y: number): void {
        if(!this._name) return;

        this.obj.removeChildren();

        const nameText = this._render.createText(this._name, x, y, colors["white"], 20, true);
        nameText.x -= nameText.width / 2;
        nameText.y -= nameText.height / 2;

        this.obj.addChild(nameText);
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

    public update(delta: number) {
        if(!this._isHeld) {
            const sumForce = Force.add(this._forces.getSum(), this._onceForces.getSum());
            const accelerate = sumForce.getAccelerate(this.mass);
            
            this.velocity = Vector.add(this.velocity, accelerate);
            this.obj.x += this.velocity.x * delta;
            this.obj.y -= this.velocity.y * delta;
    
            this.updateHitboxAnchor();
            this._onceForces.clear();
        }

        this._render.container.addChild(this.obj);
    }

    public get onPointerDown() {
        if(!this._isInteractive) throw new Error("This object is not interactive, so you cannot add listener(s) to interactive events.");

        return this._onPointerDown.event;
    }

    public get onPointerMove() {
        if(!this._isInteractive) throw new Error("This object is not interactive, so you cannot add listener(s) to interactive events.");

        return this._onPointerMove.event;
    }

    public get onPointerUp() {
        if(!this._isInteractive) throw new Error("This object is not interactive, so you cannot add listener(s) to interactive events.");

        return this._onPointerUp.event;
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

const objMap = new Map<string, { new(...args: any): any } | any>();

export function registerObject<O extends CanvasObject>(id: keyof ObjectNameMap, obj: { new(...args: any): O }): void {
    objMap.set(id, obj);
}

export function createObject<T extends keyof ObjectNameMap>(id: T, ...args: any): ObjectNameMap[T] | never {
    const objClass = objMap.get(id);

    if(!objClass) {
        throw new Error("Specified object doesn't exist.");
    }

    return new objClass(...args);
}
