import { Disposable } from "@/common/lifecycle";
import { Canvas } from "@/ui/canvas/canvas";

export class Render extends Disposable {
    private _ctx: CanvasRenderingContext2D;

    public constructor(private _canvas: Canvas) {
        super();

        this._ctx = this._canvas.ctx;
        this._init();
    }

    private _init() {
        // this._ctx.fillStyle = "#dddddd";
        // this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        // this._ctx.fill();
    }

    /** @todo */
    public refresh() {
        console.log("Refreshed.");
    }
}
