/* eslint-disable no-unused-vars */
export interface MOT {
    metadata: {
        name?: string
        description?: string
        author?: string
    }

    chunks: Chunk[]
}

export enum ChunkType {
    OBJECTS = "objects",
    WHEN = "when"
}

export interface Chunk {
    name: ChunkType
    members: Scope[]
}

export interface ObjectsChunk extends Chunk {
    name: ChunkType.OBJECTS
    members: ObjectScope[]
}

export interface WhenChunk extends Chunk {
    name: ChunkType.WHEN
    members: TimeScope[]
}

export interface Scope {
    name: string
}

export interface ObjectScope extends Scope {
    properties: Property[]
}

export interface TimeScope extends Scope {
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
