import type { Canvas } from "@/ui/canvas/canvas";
import type { CanvasObject } from "./object";
import type { Point } from "./render/render";

import { Emitter, type Event } from "@/common/event";
import { Disposable, type IDisposable } from "@/common/lifecycle";

export interface IHitbox<D> extends IDisposable {
    anchor: Point

    /**
     * Run a hitbox test between this hitbox and the target object
     * 
     * @param obj A target object to test
     */
    test(obj: CanvasObject): void
    testWall(canvas: Canvas): "x" | "y" | null
    /**
     * Set a new anchor for the hitbox
     * 
     * @param anchor The new anchor
     */
    setAnchor(anchor: Point): void
    /**
     * Cancel a test running in the next frame
     * 
     * In order to avoid duplicated hitbox tests.
     */
    cancelNextTest(): void

    onHit: Event<D & { obj: CanvasObject }>
}

export abstract class Hitbox<D = any> extends Disposable implements IHitbox<D> {
    // events
    protected _onHit: Emitter<D & { obj: CanvasObject }> = new Emitter();

    protected _isNextTestCancelled: boolean = false;

    public constructor(public anchor: Point) {
        super();

        this._register(this._onHit);
    }

    public abstract test(obj: CanvasObject): void;
    public abstract testWall(canvas: Canvas): "x" | "y" | null;

    public setAnchor(anchor: Point) {
        this.anchor = anchor;
    }

    public cancelNextTest() {
        this._isNextTestCancelled = true;
    }

    public get onHit() {
        return this._onHit.event;
    }
}
