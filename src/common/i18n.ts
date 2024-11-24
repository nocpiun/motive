import { getLocale } from "@/locales";

const langStorageKey = "motive:lang";
const defaultLang = "zh-cn";
const storage = window.localStorage;

export function initI18n(): void {
    if(!storage.getItem(langStorageKey)) {
        setLang(defaultLang);
    }

    document.documentElement.lang = getLang();
}

export function getLang(): string {
    return storage.getItem(langStorageKey) ?? defaultLang;
}

export function setLang(lang: string): void {
    storage.setItem(langStorageKey, lang);
}

/**
 * I18n string getter
 * 
 * @param key The key of the locale string
 * @returns {string} The locale string
 */
export function i18n(key: string): string {
    const lang = getLang();
    const locale = getLocale(lang);

    return locale[key] ?? key;
}

export { i18n as $ };
