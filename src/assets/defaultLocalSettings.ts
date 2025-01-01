import type { GlobalSettingsList } from "@/common/settings";

import { getLangList, getLocale } from "@/locales";
import { $ } from "@/common/i18n";

export default {
    language: {
        name: $("settings.language"),
        description: $("settings.language.description"),
        value: "zh-cn",
        type: "select",
        controlOptions: {
            selections: getLangList().map((lang) => ({
                value: lang,
                text: getLocale(lang)["lang"]
            }))
        }
    },
    gravity: {
        name: $("settings.gravity"),
        description: $("settings.gravity.description"),
        value: 1,
        type: "input",
        controlOptions: {
            type: "number",
            minValue: 0,
        }
    },
    friction: {
        name: $("settings.friction"),
        description: $("settings.friction.description"),
        value: 30,
        type: "input",
        controlOptions: {
            type: "number",
            minValue: 0
        }
    },
    damping: {
        name: $("settings.damping"),
        description: $("settings.damping.description"),
        value: 90,
        type: "input",
        controlOptions: {
            type: "number",
            minValue: 0,
            maxValue: 100
        }
    },
} as GlobalSettingsList;
