import type * as PIXI from "pixi.js";
import type { Node } from "@/common/utils/linkedNodes";
import type { ObjectModal, ObjectSettingsList } from "@/ui/modal/objectModal";
import type { Point, Render, Renderable } from "./render/render";
import type { Hitbox } from "./hitbox";
import type { Ground } from "./objects/ground";
import type { Ball } from "./objects/ball";
import type { Block } from "./objects/block";

import { Emitter, type Event } from "@/common/event";
import { Disposable } from "@/common/lifecycle";
import { modalProvider } from "@/ui/modal/modalProvider";

import { Vector } from "./vector";
import { Force, ForceCollection } from "./force";
import { colors } from "./render/colors";

interface ICanvasObject extends Renderable {
    obj: PIXI.ContainerChild
    mass: number
    velocity: Vector
    nodePtr?: Node<CanvasObject> // for linked nodes to search for the object (This might be a bad practice)

    /**
     * Set the name of the object
     * 
     * @param name The name of the object
     */
    setName(name: string): void
    /**
     * Set the mass of the object and update the gravity force
     * 
     * @param mass The mass of the object
     */
    setMass(mass: number): void
    /**
     * Apply a force to the object
     * 
     * @param key The key of the force
     * @param force The force to apply
     */
    applyForce(key: string, force: Force): void
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
    onSettingsSave: Event<ObjectSettingsList>
}

export class CanvasObject<H extends Hitbox = Hitbox> extends Disposable implements ICanvasObject {
    // events
    private _onPointerDown = new Emitter<PIXI.FederatedPointerEvent>();
    private _onPointerMove = new Emitter<PIXI.FederatedPointerEvent>();
    private _onPointerUp = new Emitter<PIXI.FederatedPointerEvent & { velocity: Vector }>();
    private _onSettingsSave = new Emitter<ObjectSettingsList>();
    
    protected _name?: string;

    private _forces: ForceCollection = new ForceCollection();

    private _isInteractive: boolean = false;
    private _isHeld: boolean = false;
    private _mousePoint: Point | null = null;
    private _mouseMovingTime: number | null = null;
    private _mouseVelocity: Vector | null = null;

    public nodePtr?: Node<CanvasObject>;

    public constructor(
        public render: Render,
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

        this.obj.on("pointerdown", (e) => {
            if(!this.render.isMouseMode) return;

            if(!this._isHeld) {
                this._isHeld = true;

                const position = this.render.container.toLocal(e.global);

                this.velocity = Vector.Zero;
                this.obj.x = position.x;
                this.obj.y = position.y;
                this.updateHitboxAnchor();
            }

            this._onPointerDown.fire(e);
        });

        this.render.stage.on("pointermove", (e) => {
            if(!this._isHeld) return;

            const position = this.render.container.toLocal(e.global);
            const x = position.x, y = position.y;

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
        
        this.render.stage.on("pointerup", (e) => {
            if(!this._isHeld) return;

            this._isHeld = false;
            this._onPointerUp.fire({
                ...e as any,
                velocity: this._mouseVelocity ?? Vector.Zero
            });

            this._mousePoint = null;
            this._mouseMovingTime = null;
            this._mouseVelocity = null;
        });
    }

    protected _enableSettings<S extends ObjectSettingsList>(id: string, getItems: () => S): void {
        this.obj.addEventListener("rightclick", () => {
            // To avoid dragging the object
            // NOTE: This is a temporary solution
            this._isHeld = false;
            this._mousePoint = null;
            this._mouseMovingTime = null;
            this._mouseVelocity = null;

            modalProvider.open("object-settings", { id, obj: this, items: getItems() });
            
            const modal = modalProvider.getCurrentModal() as ObjectModal;
            this._register(modal.onSave(({ obj, items }) => {
                if(obj === this) this._onSettingsSave.fire(items);
            }));
        });
    }

    public setName(name: string) {
        this._name = name;
    }

    /**
     * @param x Relative x position
     * @param y Relative y position
     */
    protected _drawName(x: number, y: number): void {
        if(!this._name) return;

        this.obj.removeChildren();

        const nameText = this.render.createText(this._name, x, y, colors["white"], 20, true);
        nameText.x -= nameText.width / 2;
        nameText.y -= nameText.height / 2;

        this.obj.addChild(nameText);
    }

    public setMass(mass: number) {
        this.mass = mass;

        // Update the gravity force
        this._forces.set("gravity", Force.gravity(this.mass));
    }

    public applyForce(key: string, force: Force) {
        this._forces.add(key, force);
    }

    public applyGravity() {
        this._forces.add("gravity", Force.gravity(this.mass));
    }

    public removeForce(key: string) {
        this._forces.remove(key);
    }

    public clearForces() {
        this._forces.clear();
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
            const sumForce = this._forces.getSum();
            const accelerate = sumForce.getAccelerate(this.mass);
            
            this.velocity = Vector.add(this.velocity, accelerate);
            this.obj.x += this.velocity.x * delta;
            this.obj.y -= this.velocity.y * delta;
    
            this.updateHitboxAnchor();
        }

        this.render.container.addChild(this.obj);
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

    public get onSettingsSave() {
        return this._onSettingsSave.event;
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
