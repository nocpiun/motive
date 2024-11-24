import type { IChunk, IObjectsChunk, IWhenChunk, IScope } from "./types";

import { ObjectScope, TimeScope } from "./scope";
import { ChunkType } from "./types";

export abstract class Chunk<S extends IScope = any> implements IChunk {
    public abstract readonly name: ChunkType;

    public constructor(public members: S[]) { }
    
    public abstract addScope(name: string): IScope;
}

export class ObjectsChunk extends Chunk<ObjectScope> implements IObjectsChunk {
    public readonly name = ChunkType.OBJECTS;

    public constructor() {
        super([]);
    }

    public addScope(name: string): ObjectScope {
        const scope = new ObjectScope(name);

        this.members.push(scope);
        return scope;
    }
}

export class WhenChunk extends Chunk<TimeScope> implements IWhenChunk {
    public readonly name = ChunkType.WHEN;

    public constructor() {
        super([]);
    }

    public addScope(name: string): TimeScope {
        const scope = new TimeScope(name);

        this.members.push(scope);
        return scope;
    }
}
