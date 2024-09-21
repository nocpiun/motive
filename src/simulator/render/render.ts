import type { Canvas } from "@/ui/canvas/canvas";
import type { CanvasObject } from "@/simulator/object";

import * as PIXI from "pixi.js";

import { Disposable, type IDisposable } from "@/common/lifecycle";
import { LinkedNodes } from "@/common/utils/linkedNodes";
import { Ball } from "@/simulator/objects/ball";
import { Ground } from "@/simulator/objects/ground";
import { Vector } from "@/simulator/vector";

export interface Renderable {
    update(delta: number, container: PIXI.Container): void
}

export interface Point {
    x: number
    y: number
}

interface IRender extends Renderable, IDisposable {
    refresh(): void
}

export class Render extends Disposable implements IRender {
    private _app: PIXI.Application;
    private _container: PIXI.Container = new PIXI.Container({ x: 0, y: 0 });
    private _objects: LinkedNodes<CanvasObject> = LinkedNodes.empty();

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

    private _init() {

        this._objects.push(new Ground(this._app.canvas));
        
        // this._objects.push(new Ball(100, this._app.canvas.height - Ground.GROUND_HEIGHT - 15, 15, 1, new Vector(8, 0)));
        this._objects.push(new Ball(100, 300, 15, 1, new Vector(8, 0)));
    }

    private _initTimer() {
        this._app.ticker.add((ticker) => {
            this.update(ticker.deltaTime);
        });
    }

    private _clearObjects(): void {
        for(const obj of this._objects) {
            obj.dispose();
        }
        this._objects.clear();
    }

    public refresh() {
        this._clearObjects();
        this._init();
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
        this._clearObjects();

        super.dispose();
    }
}
