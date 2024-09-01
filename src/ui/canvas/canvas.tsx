import { Component, ComponentLike, IComponent } from "@/ui/ui";

import "./canvas.less";

export interface CanvasOptions {
    width?: number
    height?: number
}

const defaultOptions: CanvasOptions = {
    width: window.innerWidth,
    height: window.innerHeight
};

interface ICanvas extends IComponent {
    width: number
    height: number
    ctx: CanvasRenderingContext2D
}

export class Canvas extends Component<HTMLCanvasElement, CanvasOptions> implements ICanvas {
    private _ctx: CanvasRenderingContext2D;

    public constructor(target: ComponentLike, _options?: CanvasOptions) {
        super(
            <canvas className="motive-canvas"/>,
            target,
            defaultOptions,
            _options
        );

        if(this._options.width) this._element.width = this._options.width;
        if(this._options.height) this._element.height = this._options.height;

        if(process.env.NODE_ENV !== "test") {
            this._ctx = this._element.getContext("2d");
            
            if(!this._ctx) {
                throw new Error("Unable to get the 2D context from canvas.");
            }
        }
    }

    public get width() {
        return this._element.width;
    }

    public get height() {
        return this._element.height;
    }

    public get ctx() {
        return this._ctx;
    }
}
