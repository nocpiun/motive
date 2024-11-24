import type { Canvas } from "@/ui/canvas/canvas";

import * as PIXI from "pixi.js";

import { createObject, type ObjectNameMap, type CanvasObject } from "@/simulator/object";
import { Disposable, type IDisposable } from "@/common/lifecycle";
import { LinkedNodes } from "@/common/utils/linkedNodes";
import { Ground } from "@/simulator/objects/ground";
import { Emitter, type Event } from "@/common/event";

import { type Color, colors } from "./colors";
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

interface OnRenderListenerData {
    delta: number
    fps: number
}

interface IRender extends Renderable, IDisposable {
    stage: PIXI.Container
    container: PIXI.Container
    canvas: Canvas

    /**
     * Create and add an object to the system
     */
    addObject(...args: Parameters<typeof createObject>): CanvasObject
    /**
     * Delete an object from the object list
     * 
     * @param object The object to delete
     */
    deleteObject(object: CanvasObject): void
    /**
     * Clear all objects in the system
     */
    clearObjects(): void
    /**
     * Create a text object
     * 
     * @param text Text content
     * @param x Position x
     * @param y Position y
     * @param color Text color
     * @param size Text size
     * @param italic Is the text italic
     */
    createText(text: string, x: number, y: number, color?: Color, size?: number, italic?: boolean): PIXI.Text
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
    /**
     * Toggle the mouse mode (on / off)
     * 
     * @param enabled Is the mouse mode enabled
     */
    setMouseMode(enabled: boolean): void
    /**
     * Toggle the wall mode (on / off)
     * 
     * @param enabled Is the wall mode enabled
     */
    setWallMode(enabled: boolean): void
    getObjects(): CanvasObject[]

    onRender: Event<OnRenderListenerData>
    onRefresh: Event<void>
}

export class Render extends Disposable implements IRender {
    // events
    private _onRender = new Emitter<OnRenderListenerData>();
    private _onRefresh = new Emitter();

    private _app: PIXI.Application;
    private _objects: LinkedNodes<CanvasObject> = LinkedNodes.empty();
    private _prerenderObjects: LinkedNodes<CanvasObject> = LinkedNodes.empty();
    private _unremovableObjects: LinkedNodes<CanvasObject> = LinkedNodes.empty();
    public container = new PIXI.Container({ x: 0, y: 0 });

    public isPaused: boolean = false;
    public isMouseMode: boolean = false;
    public isWallMode: boolean = true;

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

    public get stage() {
        return this._app.stage;
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

            // Test wall
            if(!this.isWallMode) return;

            const hitDirection = obj.hitbox.testWall(this.canvas);
            if(hitDirection) {
                obj.reverseVelocity(hitDirection);
            }
        }
    }

    public addObject<T extends keyof ObjectNameMap>(...args: Parameters<typeof createObject>): CanvasObject {
        const [id, ...objArgs] = args;
        const obj = createObject<T>(id as T, this, ...objArgs) as CanvasObject;

        this._prerenderObjects.push(obj);
        obj.nodePtr = this._objects.push(obj);

        return obj;
    }

    public deleteObject(obj: CanvasObject) {
        obj.dispose();
        this._objects.remove(obj.nodePtr);
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

    public createText(text: string, x: number, y: number, color: Color = colors["black"], size: number = 18, italic: boolean = false) {
        return new PIXI.Text({
            text,
            x, y,
            style: {
                fontFamily: italic ? "KaTeX-Italic" : "KaTeX-Regular",
                fontSize: size,
                fontWeight: "200",
                fill: color
            }
        });
    }

    public refresh() {
        this.clearObjects();
        this._initObjects();
        
        this._onRefresh.fire();
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

    public setWallMode(enabled: boolean) {
        this.isWallMode = enabled;
    }

    public getObjects() {
        return this._objects.toArray();
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

        // Display Debug Info
        if(process.env.NODE_ENV === "development") {
            const infoList: string[] = [];

            infoList.push(`Objects: ${this._objects.length}`);
            if(this.isMouseMode) infoList.push("MouseMode");
            if(this.isWallMode) infoList.push("WallMode");

            for(let i = 0; i < infoList.length; i++) {
                this.container.addChild(this.createText(infoList[i], 10, 10 + i * 20));
            }
        }

        // Fire Event
        this._onRender.fire({ delta, fps: this._app.ticker.FPS });
    }

    public get onRender() {
        return this._onRender.event;
    }

    public get onRefresh() {
        return this._onRefresh.event;
    }

    public override dispose() {
        this._app.ticker.stop();
        this.clearObjects();

        super.dispose();
    }
}
