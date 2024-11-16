import { ReplaceAll } from "lucide";
import type { MOT } from "./types";

declare global {
    interface String {
        replaceAll(searchValue: string | RegExp, replaceValue: string): string;
    }
}
  
String.prototype.replaceAll = function(searchValue, replaceValue) {
    return this.replace(new RegExp(searchValue, 'g'), replaceValue);
};
  
export class MOTC {
    private static _debug: boolean = true;

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
        const lines = src.split("\n");

        //临时变量
        let name_ = "";
        let val_ = "";

        let record:boolean = false;
        let loop:boolean = true;

        let keyword:string = "";
        let level:number = 0;

        let name:string = "Unnamed";
        let author:string = "";
        let description:string = "";
        
        let block:string = "";
        let objectBlock:string = "";
        let whenBlock:string = "";

        let objectsMap = new Map<string, Map<string, string>>();
        let whensMap = new Map<string, Map<string, string>>();

        // @objects 和 @when 的检测
        for(let line of lines) {
            line = line.replaceAll("  ", "");

            if(/^@objects/.test(line)) {
                keyword = "objects";

                if(MOTC._debug) {
                    console.log("object found");
                }
            }
            if(/^@when/.test(line)) {
                keyword = "when";
                
                if(MOTC._debug) {
                    console.log("when found");
                }
            }

            for(let str of line) {
                if(str === "}") {
                    level -= 1;
                }

                if(record && level === 0) {
                    record = false;

                    if(MOTC._debug) {
                        console.log("block: " + block);
                    }

                    if(keyword === "objects") {
                        objectBlock = block;
                    }
                    if(keyword === "when") {
                        whenBlock = block;
                    }
                    block = "";
                }

                if(record) {
                    block += str;
                }

                if(str === "{") {
                    level += 1;
                    record = true;
                }
            }
        }

        let objects = objectBlock.split(",");
        let whens = whenBlock.split(",");
        let elementMap = new Map<string, string>();

        // @object 内部的检测
        for(let singleObject of objects) {
            for(let str of singleObject) {
                if(!record && str !== "{" && str !== " ") {
                    name_ += str;
                }

                if(str === "}") {
                    level -= 1;
                }

                if(record && level === 0) {
                    record = false;

                    for(let element of val_.split(";")) {
                        if(element !== "") {
                            elementMap.set(element.split(":")[0], element.split(":")[1])
                        }
                    }

                    objectsMap.set(name_, elementMap);

                    if(MOTC._debug) {
                        console.log("\nname_: " + name_ + "\nval_: " + val_);
                    }

                    elementMap.clear();
                    name_ = "";
                    val_ = "";

                    break;
                }

                if(record) {
                    val_ += str
                }

                if(str === "{") {
                    level += 1;
                    record = true;
                }
            }            
        }

        // @when 内部的检测
        for(let singleWhen of whens) {
            for(let str of singleWhen) {
                if(!record && str !== "{" && str !== " ") {
                    name_ += str;
                }
    
                if(str === "}") {
                    level -= 1;
                }
    
                if(record && level === 0) {
                    record = false;
    
                    for(let element of val_.split(";")) {
                        if(element !== "") {
                            elementMap.set(element.split(":")[0], element.split(":")[1])
                        }
                    }

                    whensMap.set(name_, elementMap);

    
                    if(MOTC._debug) {
                        console.log("\nname_: " + name_ + "\nval_: " + val_ + "\nelementMap: " + elementMap.entries() + "\nwhensMap: " + whensMap.entries());
                    }

                    elementMap.clear();
                    whensMap[name_] = val_;
                    name_ = "";
                    val_ = "";
    
                    break;
                }
    
                if(record) {
                    val_ += str
                }
    
                if(str === "{") {
                    level += 1;
                    record = true;
                }
            }
        }
    
        // 元信息关键字的检测
        for(let line of lines) {
            switch(true) {
                case /^#name/.test(line):
                    keyword = "name";
                    name = line.slice(6);
                    break;
                case /^#author/.test(line):
                    keyword = "author";
                    author = line.slice(8);
                    break;
                case /^#description/.test(line):
                    keyword = "description";
                    description = line.slice(13);
                    break;
            }
        }            
        
        if(MOTC._debug) {
            console.log(`name: ` + name + "\nauthor: " + author + "\ndescription: " + description + "\nobjectBlock: " + objectBlock + "\nwhenBlock: " + whenBlock + "\nobjectsMap: " + objectsMap + "\nwhensMap: " + whensMap);
        }

        return new MOTC(src)._tokenize();
    }
}