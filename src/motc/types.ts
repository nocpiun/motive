export interface MOT {
    metadata: {
        name?: string
        description?: string
        author?: string
    }

    chunks: Chunk[]
}

type ChunkName = "objects" | "when";

export interface Chunk {
    name: ChunkName
    members: Scope[]
}

export interface ObjectsChunk extends Chunk {
    name: "objects"
    members: ObjectScope[]
}

export interface WhenChunk extends Chunk {
    name: "when"
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

type StatementVerb = "move" | "delete";

export interface Statement {
    verb: StatementVerb
    args: string[]
}
