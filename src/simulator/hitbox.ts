import type { CanvasObject } from "./object";
import type { Point } from "./render/render";

import { Emitter, type Event } from "@/common/event";
import { Disposable, type IDisposable } from "@/common/lifecycle";

export interface IHitbox extends IDisposable {
    test(obj: CanvasObject): void
    setAnchor(anchor: Point): void
    cancelNextTest(): void

    onHit: Event<CanvasObject>
}

export abstract class Hitbox extends Disposable implements IHitbox {
    // events
    protected _onHit = new Emitter<CanvasObject>();

    protected _isNextTestCancelled: boolean = false;

    public constructor(protected _anchor: Point) {
        super();

        this._register(this._onHit);
    }

    public abstract test(obj: CanvasObject): void;

    public setAnchor(anchor: Point) {
        this._anchor = anchor;
    }

    public cancelNextTest() {
        this._isNextTestCancelled = true;
    }

    public get onHit() {
        return this._onHit.event;
    }
}
