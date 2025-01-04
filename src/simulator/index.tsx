import type { ObjectNameMap } from "./object";

import {
    Box,
    Circle,
    Cuboid,
    Grid2X2,
    Radius,
    Shell,
    Slash,
    Spline,
    TriangleRight
} from "lucide";

import { Disposable } from "@/common/lifecycle";
import { Canvas } from "@/ui/canvas/canvas";
import { Panel } from "@/ui/panel/panel";
import { Settings } from "@/common/settings";
import { $, getLang } from "@/common/i18n";
import IconLight from "@/assets/icons/icon-light.png";
import IconDark from "@/assets/icons/icon-dark.png";

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
        // Init metadata
        document.title = $("app.name");
        document.querySelector("html").lang = getLang();
        document.head.appendChild(<link rel="icon" href={IconLight} media="(prefers-color-scheme: light)" type="image/png"/>);
        document.head.appendChild(<link rel="icon" href={IconDark} media="(prefers-color-scheme: dark)" type="image/png"/>);

        this._canvas = new Canvas(this._root);
        this._render = new Render(this._canvas);
        
        this._panel = new Panel(this._root);

        // Layout
        if(Settings.get().getValue("layout") === "top") this._root.classList.add("layout-reverse");
        
        // Register object switchers
        this._panel.addObjectSwitcher("ball", $("obj.ball"), Circle, false, true);
        this._panel.addObjectSwitcher("block", $("obj.block"), Box);
        this._panel.addObjectSwitcher("board", $("obj.board"), Cuboid, true);
        this._panel.addObjectSwitcher("slope", $("obj.slope"), TriangleRight, true);
        this._panel.addObjectSwitcher("rope", $("obj.rope"), Spline, true);
        this._panel.addObjectSwitcher("pole", $("obj.pole"), Slash, true);
        this._panel.addObjectSwitcher("spring", $("obj.spring"), Shell, true);
        this._panel.addObjectSwitcher("arc", $("obj.arc"), Radius, true);
        this._panel.addObjectSwitcher("fixed", $("obj.fixed"), Grid2X2, true);

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

        this._register(Settings.get().onDidChange(({ key, value }) => {
            if(key === "layout") {
                value === "top"
                ? this._root.classList.add("layout-reverse")
                : this._root.classList.remove("layout-reverse");
            }
        }));
    }
}
