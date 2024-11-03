import type { ObjectNameMap } from "./object";

import { Box, Circle, Cuboid, Spline } from "lucide";

import { Disposable } from "@/common/lifecycle";
import { Canvas } from "@/ui/canvas/canvas";
import { Panel } from "@/ui/panel/panel";

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
        
        // Register object switchers
        this._panel.addObjectSwitcher("ball", "小球", Circle, false, true);
        this._panel.addObjectSwitcher("block", "木块", Box);
        this._panel.addObjectSwitcher("board", "木板", Cuboid, true);
        this._panel.addObjectSwitcher("rope", "绳子", Spline, true);

        // Initialize the control panel
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
            if(this._render.isMouseMode) return;

            const obj = this._render.addObject(this._selectedObjectId, e.screenX, e.screenY);
            obj.setName("m");
        }));

        this._register(this._canvas.onRefresh(() => {
            if(!this._render.isPaused) this._render.refresh();
        }));
    }
}
