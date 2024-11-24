import zh_cn from "./zh-cn.json";
import zh_tw from "./zh-tw.json";
import en_us from "./en-us.json";

export function getLocale(lang: string): { [key: string]: string } {
    switch(lang) {
        case "zh-cn": return zh_cn;
        case "zh-tw": return zh_tw;
        case "en-us": return en_us;
    }
}
