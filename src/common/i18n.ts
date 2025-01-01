import { getLocale } from "@/locales";

import { settingsStorageKey } from "./global";

const defaultLang = "zh-cn";

export function getLang(): string {
    const settings = JSON.parse(window.localStorage.getItem(settingsStorageKey));

    if(!settings || !Object.keys(settings).includes("language")) {
        return defaultLang;
    }
    
    return settings["language"];
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
