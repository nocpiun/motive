import { Disposable } from "@/common/lifecycle";
import { Canvas } from "@/ui/canvas/canvas";
import { Render } from "@/render/render";
import { Panel } from "@/ui/panel/panel";

export class Motive extends Disposable {
    private _canvas: Canvas;
    private _render: Render;
    private _panel: Panel;

    public constructor(private _root: HTMLElement) {
        super();

        this._init();
    }

    private _init(): void {
        this._canvas = new Canvas(this._root);
        this._render = new Render(this._canvas);
        
        this._panel = new Panel(this._root);
        this._panel.linkRenderer(this._render);

        this._register(this._canvas);
        this._register(this._render);
        this._register(this._panel);
    }
}
