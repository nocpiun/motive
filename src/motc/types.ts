/* eslint-disable no-unused-vars */
export interface MOT {
    metadata: {
        name?: string
        description?: string
        author?: string
    }

    chunks: IChunk[]
}

export enum ChunkType {
    OBJECTS = "objects",
    WHEN = "when"
}

export interface IChunk {
    name: ChunkType
    members: IScope[]
}

export interface IObjectsChunk extends IChunk {
    name: ChunkType.OBJECTS
    members: IObjectScope[]
}

export interface IWhenChunk extends IChunk {
    name: ChunkType.WHEN
    members: ITimeScope[]
}

export interface IScope {
    name: string
}

export interface IObjectScope extends IScope {
    properties: Property[]
}

export interface ITimeScope extends IScope {
    statements: Statement[]
}

export interface Property {
    key: string
    value: string
}

export enum StatementType {
    MOVE = "move",
    DELETE = "delete"
}

export interface Statement {
    verb: StatementType
    args: string[]
}
