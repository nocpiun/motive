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
        let lines = src.split("\n");
        let tempKeyword: string = "";
        
        let record: boolean = false;
        let record_2: boolean = false;

        let objects:string[] = [];

        let block:string = "";
        let block2:string = "";

        let blocks:string[] = [];
        let blocks2:string[] = [];

        for (let line of lines) {
            for (let str of line) {
                if (str === "}") {
                    if (record_2) {
                        record_2 = false;
                    } else {
                        record = false;
                        blocks.push(block);
                        block = "";
                    }
                }

                if (record && str !== " ") {
                    block += str;
                }

                if (str === "{") {
                    if (record) {
                        record_2 = true;
                    } else {
                        record = true;
                    }
                }


            }
        }

        for (let str of block) {
            if (str === "}") {
                if (record_2) {
                    record_2 = false;
                } else {
                    record = false;
                    blocks2.push(block2);
                    block2 = ""
                }
            }

            if (record && str !== " ") {
                block2 += str;
            }

            if (str === "{") {
                if (record) {
                    record_2 = true;
                } else {
                    record = true;
                }
            }


        }

        console.log(blocks + "\n");
        console.log(blocks2)

        for (let line of lines) {
            if (!record) {
                switch (true) {
                    case /^#name/.test(line):
                        let name = line.slice(6);
                        tempKeyword = "name";

                        console.log(line);
                        console.log("keyword \"name\" found!");
                        console.log(tempKeyword);
                        console.log("Arg - name: " + name + "\n");
                        break;
                    case /^#description/.test(line):
                        let description = line.slice(13);
                        tempKeyword = "description";
                        
                        console.log(line);
                        console.log("Keyword \"description\" found!");
                        console.log(tempKeyword);
                        console.log("Arg - description: " + description + "\n");
                        break;
                    case /^#author/.test(line):
                        let author = line.slice(8);
                        tempKeyword = "author";
                        
                        console.log(line);
                        console.log("Keyword \"author\" found!");
                        console.log(tempKeyword);
                        console.log("Arg - author: " + author + "\n");
                        break;
                    case /^@objects/.test(line) && /{/.test(line):
                        tempKeyword = "objects";
                        record = true;

                        console.log(line);
                        console.log("Keyword \"objects\" found!");
                        console.log(tempKeyword);
                        break;
                }
            }
        }

        return new MOTC(src)._tokenize();
    }
}