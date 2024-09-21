import type { Canvas } from "@/ui/canvas/canvas";
import type { CanvasObject } from "@/simulator/object";

import * as PIXI from "pixi.js";

import { Disposable, type IDisposable } from "@/common/lifecycle";
import { LinkedNodes } from "@/common/utils/linkedNodes";
import { Ball } from "@/simulator/objects/ball";
import { Ground } from "@/simulator/objects/ground";
import { Vector } from "@/simulator/vector";

export interface Renderable {
    /**
     * Update the states and render the next frame of the canvas or an object
     * 
     * @param delta The time passed since the last frame
     * @param container The parent container
     */
    update(delta: number, container: PIXI.Container): void
}

export interface Point {
    x: number
    y: number
}

interface IRender extends Renderable, IDisposable {
    /**
     * Add an object to the system
     * 
     * @param obj The object to add
     */
    addObject(obj: CanvasObject): void
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
}

export class Render extends Disposable implements IRender {
    private _app: PIXI.Application;
    private _container: PIXI.Container = new PIXI.Container({ x: 0, y: 0 });
    private _objects: LinkedNodes<CanvasObject> = LinkedNodes.empty();

    private _isPaused: boolean = false;

    public constructor(private _canvas: Canvas) {
        super();

        this._register(this._canvas.onLoad((app: PIXI.Application) => {
            this._app = app;

            this._container.width = this._canvas.width;
            this._container.height = this._canvas.height;
            this._app.stage.addChild(this._container);

            this._init();
            this._initTimer();
        }));
    }

    private _init(): void {

        this._objects.push(new Ground(this._app.canvas));
        
        // this._objects.push(new Ball(100, this._app.canvas.height - Ground.GROUND_HEIGHT - 15, 15, 1, new Vector(8, 0)));
        this._objects.push(new Ball(100, 300, 15, 1, new Vector(8, 0)));
    }

    private _initTimer(): void {
        this._app.ticker.add((ticker) => {
            this.update(ticker.deltaTime);
        });
    }

    public addObject(obj: CanvasObject) {
        this._objects.push(obj);
    }

    public clearObjects() {
        for(const obj of this._objects) {
            obj.dispose();
        }
        this._objects.clear();
    }

    public refresh() {
        this.clearObjects();
        this._init();
    }

    public pause() {
        
    }

    public unpause() {
        
    }

    public update(delta: number) {
        this._container.removeChildren();

        for(const obj of this._objects) {
            obj.update(delta, this._container);

            for(const _obj of this._objects) {
                if(_obj !== obj) {
                    obj.hitbox.test(_obj);
                }
            }
        }
    }

    public override dispose() {
        this._app.ticker.stop();
        this.clearObjects();

        super.dispose();
    }
}
