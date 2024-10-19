import type { Canvas } from "@/ui/canvas/canvas";

import * as PIXI from "pixi.js";

import { createObject, type CanvasObject } from "@/simulator/object";
import { Disposable, type IDisposable } from "@/common/lifecycle";
import { LinkedNodes } from "@/common/utils/linkedNodes";
import { Ground } from "@/simulator/objects/ground";

import { colors } from "./colors";
// import { Ball } from "@/simulator/objects/ball";
// import { Vector } from "@/simulator/vector";

export interface Renderable {
    /**
     * Update the states and render the next frame of the canvas or an object
     * 
     * @param delta The time passed since the last frame
     * @param container The parent container
     */
    update(delta: number): void
}

export interface Point {
    x: number
    y: number
}

interface IRender extends Renderable, IDisposable {
    container: PIXI.Container
    canvas: Canvas

    /**
     * Create and add an object to the system
     */
    addObject(...args: Parameters<typeof createObject>): void
    /**
     * Clear all objects in the system
     */
    clearObjects(): void
    /**
     * Set the whole system to the initial state
     */
    refresh(): void
    /**
     * Pause the whole system at the current state
     */
    pause(): void
    /**
     * Let the system continue to run
     */
    unpause(): void
    setMouseMode(enabled: boolean): void
}

export class Render extends Disposable implements IRender {
    private _app: PIXI.Application;
    private _objects: LinkedNodes<CanvasObject> = LinkedNodes.empty();
    private _prerenderObjects: LinkedNodes<CanvasObject> = LinkedNodes.empty();
    private _unremovableObjects: LinkedNodes<CanvasObject> = LinkedNodes.empty();
    public container = new PIXI.Container({ x: 0, y: 0 });

    public isPaused: boolean = false;
    public isMouseMode: boolean = false;

    public constructor(public canvas: Canvas) {
        super();

        this._register(this.canvas.onLoad((app: PIXI.Application) => {
            this._app = app;

            // Invisible background for interactions
            const bg = new PIXI.Graphics().rect(0, 0, this.canvas.width, this.canvas.height).fill(colors["transparent"]);
            this._app.stage.addChild(bg);
            
            // Container
            this.container.width = this.canvas.width;
            this.container.height = this.canvas.height;
            this._app.stage.addChild(this.container);
            
            this._init();
            this._initObjects();
            this._initTimer();
        }));
    }

    /**
     * Initialize the whole renderer and the system when the renderer is created,
     * adding something unremovable, such as ground etc.
     * 
     * This is an **one-time** method.
     */
    private _init(): void {
        this._unremovableObjects.push(new Ground(this));
    }

    /** Initialize the system every time after the renderer refreshed. */
    private _initObjects(): void {
        // this._objects.push(new Ball(100, this._app.canvas.height - Ground.GROUND_HEIGHT - 15, 15, 1, new Vector(8, 0)));
        // this._objects.push(new Ball(100, 200, 15, 1, new Vector(1, 0)));
        // this._objects.push(new Ball(170, this._app.canvas.height - Ground.GROUND_HEIGHT - 15, 15, 1, new Vector(0, 0)));
    }

    private _initTimer(): void {
        this._app.ticker.add((ticker) => {
            this.update(ticker.deltaTime);
        });
    }

    private _renderObjectList(objList: LinkedNodes<CanvasObject>, delta: number, hitboxTest: boolean = true): void {
        for(const obj of objList) {
            obj.update(delta);

            if(!hitboxTest) continue;

            // Hitbox tests
            for(const _obj of this._objects) {
                if(_obj !== obj) {
                    obj.hitbox.test(_obj);
                }
            }
        }
    }

    public addObject(...args: Parameters<typeof createObject>) {
        const [id, ...objArgs] = args;
        const obj = createObject(id, this, ...objArgs);

        this._prerenderObjects.push(obj);
        this._objects.push(obj);
    }

    public clearObjects() {
        this.container.removeChildren();

        for(const obj of this._prerenderObjects) {
            obj.dispose();
        }
        this._prerenderObjects.clear();

        for(const obj of this._objects) {
            obj.dispose();
        }
        this._objects.clear();
    }

    public refresh() {
        this.clearObjects();
        this._initObjects();
    }

    public pause() {
        if(this.isPaused) return;

        this.isPaused = true;
    }

    public unpause() {
        if(!this.isPaused) return;

        this.isPaused = false;
    }

    public setMouseMode(enabled: boolean) {
        this.isMouseMode = enabled;
    }

    public update(delta: number) {
        // Pre-rendering stage
        if(!this._prerenderObjects.isEmpty()) {
            this._renderObjectList(this._prerenderObjects, delta, false);
            this._prerenderObjects.clear();
        }

        // Rendering stage
        if(this.isPaused) return;

        // Repaint the canvas
        this.container.removeChildren();
        this._renderObjectList(this._unremovableObjects, delta);
        this._renderObjectList(this._objects, delta);
    }

    public override dispose() {
        this._app.ticker.stop();
        this.clearObjects();

        super.dispose();
    }
}
