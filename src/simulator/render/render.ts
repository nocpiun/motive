import type { Canvas } from "@/ui/canvas/canvas";

import { Disposable, type IDisposable } from "@/common/lifecycle";

import { colors } from "./colors";

interface IRender extends IDisposable {
    refresh(): void
    update(delta: number): void
}

export class Render extends Disposable implements IRender {
    private _ctx: CanvasRenderingContext2D;
    private _timer: number;

    public constructor(private _canvas: Canvas) {
        super();

        this._ctx = this._canvas.ctx;
        this._initTimer();
    }

    private _initTimer() {
        let start: number;

        const render = (current: number) => {
            if(!start) start = current;

            this.update(current - start);
            start = current;

            this._timer = window.requestAnimationFrame(render);
        };

        this._timer = window.requestAnimationFrame(render);
    }

    /** @todo */
    public refresh() {
        console.log("Refreshed.");
    }

    public update(delta: number) {
        this._canvas.clear();
        
        // To solve the blurring issue of canvas
        this._ctx.translate(.5, .5);

        this._canvas.drawFilledRect(0, this._canvas.height - 50, this._canvas.width, 50, colors["black"]);
    }

    public override dispose() {
        window.cancelAnimationFrame(this._timer);

        super.dispose();
    }
}
