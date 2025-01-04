import type { GlobalSettingsList } from "@/common/settings";

import { ArrowLeftRight, ArrowsUpFromLine, ArrowUpFromLine, BrickWall, Languages, MonitorCog, MoveDown, PanelBottom } from "lucide";

import { getLangList, getLocale } from "@/locales";
import { $ } from "@/common/i18n";

export default {
    language: {
        name: $("settings.language"),
        description: $("settings.language.description"),
        icon: Languages,
        value: "zh-cn",
        type: "select",
        controlOptions: {
            selections: getLangList().map((lang) => ({
                value: lang,
                text: getLocale(lang)["lang"]
            }))
        }
    },
    layout: {
        name: $("settings.layout"),
        icon: PanelBottom,
        value: "bottom",
        type: "select",
        controlOptions: {
            selections: [
                { value: "top", text: $("settings.layout.top") },
                { value: "bottom", text: $("settings.layout.bottom") }
            ]
        }
    },
    fps: {
        name: $("settings.fps"),
        icon: MonitorCog,
        value: true,
        type: "toggle",
        controlOptions: {
            tooltip: "FPS"
        }
    },
    wallMode: {
        name: $("settings.border-wall"),
        icon: BrickWall,
        value: true,
        type: "toggle",
        controlOptions: {
            tooltip: $("settings.border-wall")
        }
    },
    gravity: {
        name: $("settings.gravity"),
        description: "g / m/s²",
        icon: MoveDown,
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
        icon: ArrowLeftRight,
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
        icon: ArrowsUpFromLine,
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
        icon: ArrowUpFromLine,
        value: 5,
        type: "input",
        controlOptions: {
            type: "number",
            minValue: 1
        }
    },
} as GlobalSettingsList;
