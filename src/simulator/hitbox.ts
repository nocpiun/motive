import type { CanvasObject } from "./object";
import type { Point } from "./render/render";

import { Emitter, type Event } from "@/common/event";
import { Disposable, type IDisposable } from "@/common/lifecycle";

export interface IHitbox extends IDisposable {
    anchor: Point

    test(obj: CanvasObject): void
    setAnchor(anchor: Point): void
    cancelNextTest(): void

    onHit: Event<{ obj: CanvasObject, depth: number }>
}

export abstract class Hitbox extends Disposable implements IHitbox {
    // events
    protected _onHit = new Emitter<{ obj: CanvasObject, depth: number }>();

    protected _isNextTestCancelled: boolean = false;

    public constructor(public anchor: Point) {
        super();

        this._register(this._onHit);
    }

    public abstract test(obj: CanvasObject): void;

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
