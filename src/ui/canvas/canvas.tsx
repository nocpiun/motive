import * as PIXI from "pixi.js";
import { ArrowRightFromLine, MoveUpRight, RotateCw } from "lucide";

import { Emitter, type Event } from "@/common/event";
import { Component, type ComponentLike, type IComponent } from "@/ui/ui";
import { contextMenuProvider } from "@/ui/contextMenu/contextMenuProvider";
import KatexRegularTTF from "@/assets/fonts/KaTeX_Main-Regular.ttf";
import KatexRegularWOFF from "@/assets/fonts/KaTeX_Main-Regular.woff";
import KatexRegularWOFF2 from "@/assets/fonts/KaTeX_Main-Regular.woff2";
import KatexItalicTTF from "@/assets/fonts/KaTeX_Main-Italic.ttf";
import KatexItalicWOFF from "@/assets/fonts/KaTeX_Main-Italic.woff";
import KatexItalicWOFF2 from "@/assets/fonts/KaTeX_Main-Italic.woff2";

import "./canvas.less";

export interface CanvasOptions {
    
}

const defaultOptions: CanvasOptions = { };

interface ICanvas extends IComponent {
    readonly ratio: number
    width: number
    height: number

    onLoad: Event<PIXI.Application>
    onClick: Event<PIXI.FederatedPointerEvent>
    onRefresh: Event<void>
}

export class Canvas extends Component<HTMLCanvasElement, CanvasOptions> implements ICanvas {
    // events
    private _onLoad = new Emitter<PIXI.Application>();
    private _onClick = new Emitter<PIXI.FederatedPointerEvent>();
    private _onRefresh = new Emitter();

    private readonly _app = new PIXI.Application();
    public readonly ratio: number = window.devicePixelRatio || 1;

    private readonly _pixiOptions: Partial<PIXI.ApplicationOptions> = {
        backgroundColor: 0xffffff,
        resizeTo: window,
        antialias: true
    };

    public constructor(target: ComponentLike, _options?: CanvasOptions) {
        super(
            <div className="motive-canvas-container"/>,
            target,
            defaultOptions,
            _options
        );

        if(process.env.NODE_ENV !== "test") {
            try {
                this._init();
            } catch (e) {
                throw new Error("Unable to load PIXI.js and canvas.");
            }
        }

        // Context Menu
        
        contextMenuProvider.registerContextMenu(this, [
            {
                text: "刷新画面",
                icon: RotateCw,
                action: () => this._onRefresh.fire()
            },
            { separator: true },
            {
                text: "添加向量",
                icon: MoveUpRight,
                subItems: [
                    {
                        text: "速度",
                        icon: MoveUpRight,
                    },
                    {
                        text: "力",
                        icon: ArrowRightFromLine,
                    }
                ]
            }
        ]);

        this._register(this._onLoad);
    }

    private async _init(): Promise<void> {
        // Init PIXI
        await this._app.init(this._pixiOptions);

        // Init canvas element
        this._element.appendChild(this._app.canvas);
        this._app.canvas.classList.add("motive-canvas");
        this._app.canvas.addEventListener("contextmenu", (e) => e.preventDefault());

        this._adaptDPR();

        // Load assets
        PIXI.Assets.addBundle("fonts", {
            katexRegular: {
                src: [KatexRegularTTF, KatexRegularWOFF, KatexRegularWOFF2],
                data: { family: "KaTeX-Regular" }
            },
            katexItalic: {
                src: [KatexItalicTTF, KatexItalicWOFF, KatexItalicWOFF2],
                data: { family: "KaTeX-Italic" }
            }
        });
        await PIXI.Assets.loadBundle("fonts");

        // Set up interactions
        this._app.stage.interactive = true;
        this._app.stage.on("click", (e) => {
            this._onClick.fire(e);
        });

        // Ready
        this._onLoad.fire(this._app);
    }

    /** To solve the blurring issue of canvas */
    private _adaptDPR(): void {
        const canvas = this._element.querySelector("canvas");
        const { width, height } = canvas;

        canvas.width = Math.round(width * this.ratio);
        canvas.height = Math.round(height * this.ratio);
        canvas.style.width = width +"px";
        canvas.style.height = height +"px";
    }

    public get width() {
        return this._app.canvas.width;
    }

    public get height() {
        return this._app.canvas.height;
    }

    public get onLoad() {
        return this._onLoad.event;
    }

    public get onClick() {
        return this._onClick.event;
    }

    public get onRefresh() {
        return this._onRefresh.event;
    }
}
