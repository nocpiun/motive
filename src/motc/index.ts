/* eslint-disable no-unused-vars */
import type { Scope, ObjectScope, TimeScope } from "./scope";

import { ChunkType, type StatementType, type MOT } from "./types";
import { type Chunk, ObjectsChunk, WhenChunk } from "./chunk";

enum Flag {
    LEFT_BRACE = 123, // {
    RIGHT_BRACE = 125, // }
    COLON = 58, // :
    COMMA = 44, // ,
    SEMICOLON = 59, // ;
    HASH = 35, // #
    AT = 64, // @
    SPACE = 32, //  
    NEWLINE = 10, // \n
}

export class MOTC {
    private _mot: MOT = {
        metadata: {},
        chunks: []
    };

    private _ptr: number = 0;

    private _atMetaName: boolean = false;
    private _atMetaData: boolean = false;
    private _atChunkName: boolean = false;
    private _atChunk: boolean = false;
    private _atScopeName: boolean = false;
    private _atScope: boolean = false;
    private _atPropertyName: boolean = false;
    private _atPropertyValue: boolean = false;
    private _atStatement: boolean = false;

    private _tempString: string = ""; // currently pointed string
    private _tempKeyword: string = ""; // currently pointed keyword
    private _tempChunk: Chunk | null = null; // currently pointed chunk
    private _tempScope: Scope | null = null; // currently pointed scope

    private constructor(private _src: string) { }

    private _tokenize(): MOT {
        for(this._ptr; this._ptr < this._src.length; this._ptr++) {
            const char = this._src[this._ptr];
            const code = this._getCharCode(this._ptr);

            switch(code) {
                case Flag.LEFT_BRACE:
                    if(this._atChunk && !this._atScopeName && !this._atScope) {
                        this._atScopeName = true;
                    } else if(this._atChunk && this._atScope) {
                        switch(this._tempChunk.name) {
                            case ChunkType.OBJECTS:
                                this._atPropertyName = true;
                                break;
                            case ChunkType.WHEN:
                                this._atStatement = true;
                                break;
                        }
                    }
                    break;
                case Flag.RIGHT_BRACE:
                    if(this._atScope) {
                        this._atScope = false;
                        this._atPropertyValue = false;
                        this._atStatement = false;
                        this._atScopeName = true;
                        this._tempScope = null;
                    } else {
                        this._resetStatus();
                    }
                    break;
                case Flag.HASH:
                    this._atMetaName = true;
                    break;
                case Flag.AT:
                    this._atChunkName = true;
                    break;
                case Flag.COLON:
                    if(this._atPropertyName) {
                        this._atPropertyName = false;
                        this._atPropertyValue = true;
                    }
                    break;
                case Flag.SPACE:
                    if(this._atMetaData) {
                        this._tempString += char;
                        continue;
                    }

                    if(this._atMetaName) {
                        this._atMetaName = false;
                        this._addMeta(this._tempKeyword as any, "");
                        this._atMetaData = true;
                    } else if(this._atChunkName) {
                        this._atChunkName = false;
                        this._tempChunk = this._addChunk(this._tempKeyword as any);
                        this._tempKeyword = "";
                        this._atChunk = true;
                    } else if(this._atScopeName && this._tempKeyword.length > 0) {
                        this._atScopeName = false;
                        this._tempScope = this._tempChunk.addScope(this._tempKeyword);
                        this._tempKeyword = "";
                        this._atScope = true;
                    } else if(this._atStatement && this._tempString.length > 0) {
                        this._tempString += char;
                    }
                    break;
                case Flag.NEWLINE:
                    if(this._atMetaData) {
                        this._addMeta(this._tempKeyword as any, this._tempString);
                        this._resetTemp();
                        this._resetStatus();
                    } else if(this._atPropertyValue) {
                        this._atPropertyValue = false;
                        (this._tempScope as ObjectScope).addProperty(this._tempKeyword, this._tempString);
                        this._tempKeyword = this._tempString = "";
                        this._atPropertyName = true;
                    } else if(this._atStatement && this._tempString.length > 0) {
                        const processed = this._tempString.split(" ");

                        (this._tempScope as TimeScope).addStatement(processed[0] as StatementType, processed.slice(1));
                        this._tempString = "";
                    }
                    break;
                default: // Other characters
                    if(
                        this._atMetaName ||
                        this._atChunkName ||
                        this._atScopeName ||
                        this._atPropertyName
                    ) {
                        this._tempKeyword += char;
                    } else if(this._atMetaData || this._atPropertyValue || this._atStatement) {
                        this._tempString += char;
                    }
                    break;
            }
        }

        return this._mot;
    }

    private _resetStatus(): void {
        this._atMetaName = false;
        this._atMetaData = false;
        this._atChunkName = false;
        this._atChunk = false;
        this._atScopeName = false;
        this._atScope = false;
        this._atPropertyName = false;
        this._atPropertyValue = false;
        this._atStatement = false;
    }

    private _resetTemp(): void {
        this._tempString = "";
        this._tempKeyword = "";
        this._tempChunk = null;
        this._tempScope = null;
    }

    private _addMeta(key: keyof MOT["metadata"], value: string): void {
        this._mot.metadata[key] = value;
    }

    private _addChunk(name: ChunkType): Chunk {
        let chunk: Chunk;

        switch(name) {
            case ChunkType.OBJECTS:
                chunk = new ObjectsChunk();
                break;
            case ChunkType.WHEN:
                chunk = new WhenChunk();
                break;
        }

        this._mot.chunks.push(chunk);
        return chunk;
    }

    private _getCharCode(index: number): number {
        return this._src[index].charCodeAt(0);
    }

    public static parse(src: string): MOT {
        return new MOTC(src)._tokenize();
    }
}
