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
    fps: {
        name: $("settings.fps"),
        value: true,
        type: "toggle",
        controlOptions: {
            tooltip: "FPS"
        }
    },
    wallMode: {
        name: $("settings.border-wall"),
        value: true,
        type: "toggle",
        controlOptions: {
            tooltip: $("settings.border-wall")
        }
    },
    gravity: {
        name: $("settings.gravity"),
        description: "g / m/s²",
        value: 1,
        type: "input",
        controlOptions: {
            type: "number",
            minValue: 0,
        }
    },
    friction: {
        name: $("settings.friction"),
        description: "μ",
        value: .3,
        type: "input",
        controlOptions: {
            type: "number",
            minValue: 0
        }
    },
    damping: {
        name: $("settings.damping"),
        description: "γ",
        value: .9,
        type: "input",
        controlOptions: {
            type: "number",
            minValue: 0,
            maxValue: 1
        }
    },
    stableVelocity: {
        name: $("settings.stable-velocity"),
        description: "v / m/s",
        value: 5,
        type: "input",
        controlOptions: {
            type: "number",
            minValue: 1
        }
    },
} as GlobalSettingsList;
