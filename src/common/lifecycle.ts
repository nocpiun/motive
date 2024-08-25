export interface IDisposable {
    dispose(): void
}

export class Disposable implements IDisposable {
    private _store = new Set<IDisposable>();
    protected _isDisposed: boolean = false;
    
    public dispose(): void {
        if(this._isDisposed) return;

        this._store.forEach((item) => {
            item.dispose();
        });
        this._store.clear();

        this._isDisposed = true;
    }

    protected _register(disposable: IDisposable): void {
        if(this._isDisposed) return;
        if(disposable === this) throw new Error("Cannot register a disposable object to itself.");

        this._store.add(disposable);
    }
}
