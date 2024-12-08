import type { InputOptions } from "@/ui/input/input"
import type { SwitcherOptions } from "@/ui/switcher/switcher"

interface SettingsItem<V = any> {
    name: string
    value: V
    type?: "input" | "switcher"
    controlOptions?: Omit<InputOptions, "defaultValue"> | Omit<SwitcherOptions, "defaultValue">
}

export interface GlobalSettingsItem<V = any> extends SettingsItem<V> {
    key: string
}

export interface ObjectSettingsItem<V = any> extends SettingsItem<V> { }

type SettingsList<I extends SettingsItem> = Record<string, I>;
export type GlobalSettingsList = SettingsList<GlobalSettingsItem>;
export type ObjectSettingsList = SettingsList<ObjectSettingsItem>;

export class Settings {
    private static _instance: Settings | null = null;

    private readonly storage: Storage = window.localStorage;

    private constructor() { }

    public static get(): Settings {
        if(!Settings._instance) Settings._instance = new Settings();

        return Settings._instance;
    }
}
