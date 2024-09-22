import { Disposable } from "@/common/lifecycle";
import { Canvas } from "@/ui/canvas/canvas";
import { Panel } from "@/ui/panel/panel";

import { createObject, type ObjectNameMap } from "./object";
import { Render } from "./render/render";

export class Motive extends Disposable {
    private _canvas: Canvas;
    private _render: Render;
    private _panel: Panel;

    private _selectedObjectId: keyof ObjectNameMap = "ball"; // default

    public constructor(private _root: HTMLElement) {
        super();

        this._init();
        this._initListeners();
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

    private _initListeners(): void {
        this._register(this._panel.onSelectedObjectChange((id) => {
            this._selectedObjectId = id;
        }));

        this._register(this._canvas.onClick((e) => {
            const obj = createObject(this._selectedObjectId, e.x, e.y);

            this._render.addObject(obj);
        }));
    }
}
