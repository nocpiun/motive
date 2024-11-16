/* eslint-disable no-unused-vars */
import type { MOT } from "./types";

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
    private _tempString: string = ""; // currently pointed string
    private _tempKeyword: string = ""; // currently pointed keyword

    private constructor(private _src: string) { }

    private _tokenize(): MOT {
        for(this._ptr; this._ptr < this._src.length; this._ptr++) {
            const char = this._src[this._ptr];
            const code = this._getCharCode(this._ptr);

            switch(code) {
                case Flag.LEFT_BRACE:
                    if(this._atChunk && !this._atScopeName) {
                        this._atScopeName = true;
                    } else if(this._atChunk && this._atScope) {
                        this._atPropertyName = true;
                    }
                    break;
                case Flag.RIGHT_BRACE:
                    if(this._atScope) {
                        this._atScope = false;
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
                        this._atChunk = true;
                    } else if(this._atScopeName) {
                        this._atScopeName = false;
                        this._atScope = true;
                    }
                    break;
                case Flag.NEWLINE:
                    if(this._atMetaData) {
                        this._addMeta(this._tempKeyword as any, this._tempString);
                        this._resetTemp();
                    }
                    
                    this._resetStatus();
                    break;
                default:
                    if(this._atMetaName) {
                        this._tempKeyword += char;
                    } else {
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
    }

    private _resetTemp(): void {
        this._tempString = "";
        this._tempKeyword = "";
    }

    private _addMeta(key: keyof MOT["metadata"], value: string): void {
        this._mot.metadata[key] = value;
    }

    private _getCharCode(index: number): number {
        return this._src[index].charCodeAt(0);
    }

    public static parse(src: string): MOT {
        return new MOTC(src)._tokenize();
    }
}