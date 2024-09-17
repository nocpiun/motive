import type * as PIXI from "pixi.js";
import type { Canvas } from "@/ui/canvas/canvas";
import type { CanvasObject } from "@/simulator/object";

import { Disposable, type IDisposable } from "@/common/lifecycle";
import { LinkedNodes } from "@/common/utils/linkedNodes";
import { Ball } from "@/simulator/objects/ball";

import { Ground } from "../objects/ground";
import { Vector } from "../vector";

export interface Renderable {
    update(delta: number, app: PIXI.Application): void
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
    private _objects: LinkedNodes<CanvasObject> = LinkedNodes.empty();

    public constructor(private _canvas: Canvas) {
        super();

        this._register(this._canvas.onLoad((app: PIXI.Application) => {
            this._app = app;

            this._init();
            this._initTimer();
        }));
    }

    private _init() {
        this._objects.push(new Ground(this._app.canvas));

        this._objects.push(new Ball(100, 100, 15, 1, new Vector(3, 0)));
        this._objects.push(new Ball(600, 100, 15, 3, new Vector(-1, 0)));
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
        this._app.stage.removeChildren();

        for(const obj of this._objects) {
            obj.update(delta, this._app);

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
