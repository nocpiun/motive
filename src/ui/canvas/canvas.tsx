import * as PIXI from "pixi.js";

import { Emitter, type Event } from "@/common/event";
import { Component, type ComponentLike, type IComponent } from "@/ui/ui";

import "./canvas.less";

export interface Point {
    x: number
    y: number
}

export interface CanvasOptions {
    
}

const defaultOptions: CanvasOptions = { };

interface ICanvas extends IComponent {
    readonly ratio: number
    width: number
    height: number

    onLoad: Event<PIXI.Application>
}

export class Canvas extends Component<HTMLCanvasElement, CanvasOptions> implements ICanvas {
    // events
    private _onLoad = new Emitter();

    private readonly _app = new PIXI.Application();
    public readonly ratio: number = window.devicePixelRatio || 1;

    private readonly _pixiOptions: Partial<PIXI.ApplicationOptions> = {
        backgroundColor: 0xFFFFFF,
        resizeTo: window,
        antialias: true
    };

    public constructor(target: ComponentLike, _options?: CanvasOptions) {
        super(
            <div className="motive-canvas"/>,
            target,
            defaultOptions,
            _options
        );

        if(process.env.NODE_ENV !== "test") {
            try {
                this._init();
                // this._adaptDPR();
            } catch (e) {
                throw new Error("Unable to load PIXI.js and canvas.");
            }
        }
    }

    private async _init(): Promise<void> {
        await this._app.init(this._pixiOptions);

        this._element.appendChild(this._app.canvas);
        this._app.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
        
        this._adaptDPR();

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
        return this._element.width;
    }

    public get height() {
        return this._element.height;
    }

    public get onLoad() {
        return this._onLoad.event;
    }
}
