import { getLocale } from "@/locales";

const langStorageKey = "motive:lang";
const defaultLang = "zh-cn";
const storage = window.localStorage;

export function initI18n(): void {
    if(!storage.getItem(langStorageKey)) {
        setLang(defaultLang);
    }
}

export function getLang(): string {
    return storage.getItem(langStorageKey) ?? defaultLang;
}

export function setLang(lang: string): void {
    storage.setItem(langStorageKey, lang);
}

export function i18n(key: string): string {
    const lang = getLang();
    const locale = getLocale(lang);

    return locale[key];
}

export { i18n as $ };
