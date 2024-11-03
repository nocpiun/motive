"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Motive = void 0;
const lucide_1 = require("lucide");
const lifecycle_1 = require("@/common/lifecycle");
const canvas_1 = require("@/ui/canvas/canvas");
const panel_1 = require("@/ui/panel/panel");
const render_1 = require("./render/render");
class Motive extends lifecycle_1.Disposable {
    constructor(_root) {
        super();
        this._root = _root;
        this._selectedObjectId = "ball"; // default
        this._init();
        this._initListeners();
    }
    _init() {
        this._panel = new panel_1.Panel(this._root);
        this._canvas = new canvas_1.Canvas(this._root);
        this._render = new render_1.Render(this._canvas);
        // Register object switchers
        this._panel.addObjectSwitcher("ball", "小球", lucide_1.Circle, false, true);
        this._panel.addObjectSwitcher("block", "木块", lucide_1.Box);
        this._panel.addObjectSwitcher("board", "木板", lucide_1.Cuboid, true);
        this._panel.addObjectSwitcher("rope", "绳子", lucide_1.Spline, true);
        // Initialize the control panel
        this._panel.linkRenderer(this._render);
        this._register(this._canvas);
        this._register(this._render);
        this._register(this._panel);
    }
    _initListeners() {
        this._register(this._panel.onSelectedObjectChange((id) => {
            this._selectedObjectId = id;
        }));
        this._register(this._canvas.onClick((e) => {
            if (this._render.isMouseMode)
                return;
            const obj = this._render.addObject(this._selectedObjectId, e.screenX, e.screenY);
            obj.setName("m");
        }));
        this._register(this._canvas.onRefresh(() => {
            if (!this._render.isPaused)
                this._render.refresh();
        }));
    }
}
exports.Motive = Motive;
