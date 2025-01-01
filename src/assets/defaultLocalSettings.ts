import type { GlobalSettingsList } from "@/common/settings";

import { getLangList, getLocale } from "@/locales";
import { $ } from "@/common/i18n";

export default {
    language: {
        name: $("settings.language"),
        value: "zh-cn",
        type: "select",
        controlOptions: {
            selections: getLangList().map((lang) => ({
                value: lang,
                text: getLocale(lang)["lang"]
            }))
        }
    }
} as GlobalSettingsList;
