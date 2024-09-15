import { LinkedNodes } from "./utils/linkedNodes";
import { Disposable } from "./lifecycle";

export interface Listener<T> {
    (data: T): void
    disposable?: Disposable
    once?: boolean
}

export type Event<T> = (callback: Listener<T>) => Disposable;

export class Emitter<T> extends Disposable {
    private _listeners: LinkedNodes<Listener<T>> = LinkedNodes.empty();

    public get event(): Event<T> {
        if(this._isDisposed) throw new Error("Cannot register listener to a disposed emitter.");

        return (callback: Listener<T>) => this._registerListener(callback);
    }

    public get onceEvent(): Event<T> {
        if(this._isDisposed) throw new Error("Cannot register listener to a disposed emitter.");

        return (callback: Listener<T>) => this._registerListener(callback, true);
    }

    private _registerListener(callback: Listener<T>, once: boolean = false): Disposable {
        const stored = this._listeners.push(callback);
        const disposable = {
            dispose: () => {
                this._listeners.remove(stored);
            }
        } as Disposable;

        callback.disposable = disposable;
        callback.once = once;

        this._register(disposable);
        return disposable;
    }

    public fire(data?: T): void {
        if(this._isDisposed) return;

        for(const listener of this._listeners) {
            listener(data);

            if(listener.once) {
                listener.disposable.dispose();
            }
        }
    }
}
