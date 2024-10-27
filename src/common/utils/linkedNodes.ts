export class Node<E> {
    public static readonly Undefined = new Node<any>(undefined);

    public prev: Node<E> = Node.Undefined;
    public next: Node<E> = Node.Undefined;

    public constructor(
        public value: E
    ) { }
}

export class LinkedNodes<E> {
    private _first: Node<E> = Node.Undefined;
    private _last: Node<E> = Node.Undefined;
    private _size: number = 0;

    protected constructor() { }

    public static empty<E = any>(): LinkedNodes<E> {
        return new LinkedNodes<E>();
    }

    public static from<E>(iterable: Iterable<E>): LinkedNodes<E> {
        const nodes = new LinkedNodes<E>();

        for(const item of iterable) {
            nodes.push(item);
        }

        return nodes;
    }

    public get length(): number {
        return this._size;
    }

    public isEmpty(): boolean {
        return this._first === Node.Undefined;
    }

    public toArray(): E[] {
        const arr: E[] = [];
        
        for(const node of this) {
            arr.push(node);
        }

        return arr;
    }

    public clear(): void {
        if(this.isEmpty()) return;

        let node = this._first;
        while(node !== Node.Undefined) {
            const next = node.next;
            node.prev = Node.Undefined;
            node.next = Node.Undefined;
            node.value = undefined;
            node = next;
        }

        this._first = Node.Undefined;
        this._last = Node.Undefined;
        this._size = 0;
    }

    public unshift(element: E): Node<E> {
        return this._insert(element, false);
    }

    public push(element: E): Node<E> {
        return this._insert(element, true);
    }

    private _insert(element: E, atTheEnd: boolean): Node<E> {
        const node = new Node(element);

        if(this.isEmpty()) {
            this._last = this._first = node;
        } else if(atTheEnd) {
            const last = this._last;
            this._last = node;
            node.prev = last;
            last.next = node;
        } else {
            const first = this._first;
            this._first = node;
            node.next = first;
            first.prev = node;
        }

        this._size++;

        return node;
    }

    public shift(): E | undefined {
        const first = this._first;
        this._remove(this._first);

        return first.value;
    }

    public pop(): E | undefined {
        const last = this._last;
        this._remove(this._last);

        return last.value;
    }

    public remove(target: Node<E>): void {
        this._remove(target);
    }

    private _remove(target: Node<E>): void {
        let node = this._first;
        while(node !== Node.Undefined) {
            if(node === target) {
                const prev = node.prev;
                const next = node.next;
                
                prev.next = next;
                next.prev = prev;

                if(target === this._first) this._first = next;
                if(target === this._last) this._last = prev;

                this._size--;
                
                return;
            }

            node = node.next;
        }
    }

    *[Symbol.iterator](): Iterator<E> {
        let node = this._first;
        while(node !== Node.Undefined) {
            yield node.value;
            node = node.next;
        }
    }
}
