import zh_cn from "./zh-cn.json";

export function getLocale(lang: string): { [key: string]: string } {
    switch(lang) {
        case "zh-cn": return zh_cn;
    }
}
