"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedNodes = exports.Node = void 0;
class Node {
    constructor(value) {
        this.value = value;
        this.prev = Node.Undefined;
        this.next = Node.Undefined;
    }
}
exports.Node = Node;
Node.Undefined = new Node(undefined);
class LinkedNodes {
    constructor() {
        this._first = Node.Undefined;
        this._last = Node.Undefined;
        this._size = 0;
    }
    static empty() {
        return new LinkedNodes();
    }
    static from(iterable) {
        const nodes = new LinkedNodes();
        for (const item of iterable) {
            nodes.push(item);
        }
        return nodes;
    }
    get length() {
        return this._size;
    }
    isEmpty() {
        return this._first === Node.Undefined;
    }
    toArray() {
        const arr = [];
        for (const node of this) {
            arr.push(node);
        }
        return arr;
    }
    clear() {
        if (this.isEmpty())
            return;
        let node = this._first;
        while (node !== Node.Undefined) {
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
    unshift(element) {
        return this._insert(element, false);
    }
    push(element) {
        return this._insert(element, true);
    }
    _insert(element, atTheEnd) {
        const node = new Node(element);
        if (this.isEmpty()) {
            this._last = this._first = node;
        }
        else if (atTheEnd) {
            const last = this._last;
            this._last = node;
            node.prev = last;
            last.next = node;
        }
        else {
            const first = this._first;
            this._first = node;
            node.next = first;
            first.prev = node;
        }
        this._size++;
        return node;
    }
    shift() {
        const first = this._first;
        this._remove(this._first);
        return first.value;
    }
    pop() {
        const last = this._last;
        this._remove(this._last);
        return last.value;
    }
    remove(target) {
        this._remove(target);
    }
    _remove(target) {
        let node = this._first;
        while (node !== Node.Undefined) {
            if (node === target) {
                const prev = node.prev;
                const next = node.next;
                prev.next = next;
                next.prev = prev;
                if (target === this._first)
                    this._first = next;
                if (target === this._last)
                    this._last = prev;
                this._size--;
                return;
            }
            node = node.next;
        }
    }
    *[Symbol.iterator]() {
        let node = this._first;
        while (node !== Node.Undefined) {
            yield node.value;
            node = node.next;
        }
    }
}
exports.LinkedNodes = LinkedNodes;
