import zh_cn from "./zh-cn.json";
import zh_tw from "./zh-tw.json";
import en_us from "./en-us.json";

const localeMap = new Map([
    ["zh-cn", zh_cn],
    ["zh-tw", zh_tw],
    ["en-us", en_us]
]);

export function getLocale(lang: string): { [key: string]: string } {
    return localeMap.get(lang) ?? localeMap.get("zh-cn");
}

export function getLangList(): string[] {
    return Array.from(localeMap.keys());
}
