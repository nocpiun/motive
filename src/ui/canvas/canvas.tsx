import { Component, ComponentLike, IComponent } from "@/ui/ui";
import { colors, type Color } from "@/simulator/render/colors";

import "./canvas.less";

interface Point {
    x: number
    y: number
}

export interface CanvasOptions {
    width?: number
    height?: number
}

const defaultOptions: CanvasOptions = {
    width: window.innerWidth,
    height: window.innerHeight
};

interface ICanvas extends IComponent {
    readonly ratio: number
    width: number
    height: number
    ctx: CanvasRenderingContext2D

    drawLine(start: Point, end: Point, color?: Color, lineWidth?: number): void
    drawRect(x: number, y: number, width: number, height: number, color?: Color, fillColor?: Color, lineWidth?: number): void
    drawFilledRect(x: number, y: number, width: number, height: number, color?: Color): void
    drawCircle(x: number, y: number, radius: number, color?: Color, fillColor?: Color, lineWidth?: number): void
    drawFilledCircle(x: number, y: number, radius: number, color?: Color): void
    clear(): void
}

export class Canvas extends Component<HTMLCanvasElement, CanvasOptions> implements ICanvas {
    private _ctx: CanvasRenderingContext2D;
    public readonly ratio: number = window.devicePixelRatio || 1;

    public constructor(target: ComponentLike, _options?: CanvasOptions) {
        super(
            <canvas className="motive-canvas"/>,
            target,
            defaultOptions,
            _options
        );

        if(this._options.width) this._element.width = this._options.width * this.ratio;
        if(this._options.height) this._element.height = this._options.height * this.ratio;

        if(process.env.NODE_ENV !== "test") {
            this._ctx = this._element.getContext("2d");
            
            this._adaptDPR();
            
            if(!this._ctx) {
                throw new Error("Unable to get the 2D context from canvas.");
            }
        }
    }

    /** To solve the blurring issue of canvas */
    private _adaptDPR(): void {
        const { width, height } = this._element;

        this._element.width = Math.round(width * this.ratio);
        this._element.height = Math.round(height * this.ratio);
        this._element.style.width = width +"px";
        this._element.style.height = height +"px";

        this._ctx.scale(this.ratio, this.ratio);
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

    public drawLine(start: Point, end: Point, color: Color = colors["black"], lineWidth: number = 1) {
        this._ctx.beginPath();
        this._ctx.strokeStyle = color;
        this._ctx.lineWidth = lineWidth;
        this._ctx.moveTo(start.x, start.y);
        this._ctx.lineTo(end.x, end.y);
        this._ctx.stroke();
        this._ctx.closePath();
    }

    public drawRect(x: number, y: number, width: number, height: number, color: Color = colors["black"], fillColor: Color = colors["transparent"], lineWidth: number = 1) {
        if(fillColor.length > 0) {
            this.drawFilledRect(x, y, width, height, fillColor);
        }
        this._ctx.beginPath();
        this._ctx.strokeStyle = color;
        this._ctx.lineWidth = lineWidth;
        this._ctx.strokeRect(x, y, width, height);
        this._ctx.closePath();
    }

    public drawFilledRect(x: number, y: number, width: number, height: number, color: Color = colors["black"]) {
        this._ctx.beginPath();
        this._ctx.fillStyle = color;
        this._ctx.fillRect(x, y, width, height);
        this._ctx.fill();
        this._ctx.closePath();
    }

    public drawCircle(x: number, y: number, radius: number, color: Color = colors["black"], fillColor: Color = colors["transparent"], lineWidth: number = 1) {
        if(fillColor.length > 0) {
            this.drawFilledCircle(x, y, radius, fillColor);
        }
        this._ctx.beginPath();
        this._ctx.strokeStyle = color;
        this._ctx.lineWidth = lineWidth;
        this._ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this._ctx.stroke();
        this._ctx.closePath();
    }

    public drawFilledCircle(x: number, y: number, radius: number, color: Color = colors["black"]) {
        this._ctx.beginPath();
        this._ctx.fillStyle = color;
        this._ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this._ctx.fill();
        this._ctx.closePath();
    }

    public clear(): void {
        // eslint-disable-next-line no-self-assign
        this._element.width = this._element.width;
        // eslint-disable-next-line no-self-assign
        this._element.height = this._element.height;
    }
}
