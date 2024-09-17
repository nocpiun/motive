import type { Canvas } from "@/ui/canvas/canvas";
import type { CanvasObject } from "@/simulator/object";

import * as PIXI from "pixi.js";

import { Disposable, type IDisposable } from "@/common/lifecycle";
import { LinkedNodes } from "@/common/utils/linkedNodes";
import { Ball } from "@/simulator/objects/ball";

import { colors } from "./colors";

export interface Renderable {
    update(delta: number, app: PIXI.Application): void
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
        this._objects.push(new Ball());
    }

    private _initTimer() {
        this._app.ticker.add((ticker) => {
            this.update(ticker.deltaTime);
        });
    }

    public refresh() {
        this._objects.clear();
    }

    public update(delta: number) {
        // console.log(delta);
        this._app.stage.removeChildren();

        // Fake ground
        const ground = new PIXI.Graphics().rect(0, this._app.canvas.height - 50, this._app.screen.width, 50).fill(colors["black"]);
        this._app.stage.addChild(ground);

        for(const object of this._objects) {
            object.update(delta, this._app);
        }
    }

    public override dispose() {
        this._app.ticker.stop();

        super.dispose();
    }
}
