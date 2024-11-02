import type { MOT } from "./types";

export class MOTC {
    private _mot: MOT = {
        metadata: {},
        chunks: []
    };

    private constructor(private _src: string) { }

    private _tokenize(): MOT {
        /** @todo */

        return this._mot;
    }

    public static parse(src: string): MOT {
        return new MOTC(src)._tokenize();
    }
}
