import type { InputOptions } from "@/ui/form/input/input";
import type { SwitcherOptions } from "@/ui/switcher/switcher";
import type { SelectOptions } from "@/ui/form/select/select";

import defaultLocalSettings from "@/assets/defaultLocalSettings.json";
import defaultSessionSettings from "@/assets/defaultSessionSettings.json";

export interface SettingsItem<V = any> {
    name: string
    value: V
    type?: "input" | "switcher" | "select"
    controlOptions?: (
        Omit<InputOptions, "defaultValue">
        | Omit<SwitcherOptions, "defaultValue">
        | Omit<SelectOptions, "defaultValue">
    )
}

export interface GlobalSettingsItem<V = any> extends SettingsItem<V> { }
export interface ObjectSettingsItem<V = any> extends SettingsItem<V> { }

export type SettingsList<I extends SettingsItem> = Record<string, I>;
export type GlobalSettingsList = SettingsList<GlobalSettingsItem>;
export type ObjectSettingsList = SettingsList<ObjectSettingsItem>;

export enum SettingsType {
    // eslint-disable-next-line no-unused-vars
    LOCAL, SESSION
}

interface ISettings {
    /**
     * Add a new item to the settings
     * 
     * @param key The key of the item
     * @param item The item to add
     * @param type The type of the settings list (local / session), "local" by default
     */
    addItem<V = any>(key: string, item: GlobalSettingsItem<V>, type?: SettingsType): void
    /**
     * Check if a key exists in the settings
     * 
     * @param key The key to check
     * @param type The type of the settings list (local / session), "local" by default
     */
    hasKey(key: string, type?: SettingsType): boolean
    /**
     * Get the list of settings
     * 
     * @param type The type of the settings list (local / session)
     */
    getList(type: SettingsType): GlobalSettingsList
    /**
     * Set the list of settings
     * 
     * @param list The list of settings
     * @param type The type of the settings list (local / session)
     */
    setList(type: SettingsType, list: GlobalSettingsList): void
}

const settingsStorageKey = "motive:settings";

export class Settings implements ISettings {
    private static _instance: Settings | null = null;

    private readonly _local: Storage = window.localStorage;
    private readonly _session: Storage = window.sessionStorage;

    private constructor() {
        if(!this._local.getItem(settingsStorageKey)) {
            this._local.setItem(settingsStorageKey, JSON.stringify(defaultLocalSettings));
        }
        if(!this._session.getItem(settingsStorageKey)) {
            this._session.setItem(settingsStorageKey, JSON.stringify(defaultSessionSettings));
        }

        for(const key in defaultLocalSettings) {
            if(!this.hasKey(key, SettingsType.LOCAL)) {
                this.addItem(key, defaultLocalSettings[key], SettingsType.LOCAL);
            }
        }
        for(const key in defaultSessionSettings) {
            if(!this.hasKey(key, SettingsType.SESSION)) {
                this.addItem(key, defaultSessionSettings[key], SettingsType.SESSION);
            }
        }
    }

    private _useStorage(type: SettingsType): Storage {
        return type === SettingsType.LOCAL ? this._local : this._session;
    }

    public addItem<V = any>(key: string, item: GlobalSettingsItem<V>, type: SettingsType = SettingsType.LOCAL) {
        const storage = this._useStorage(type);
        const settings = this.getList(type);

        settings[key] = item;
        storage.setItem(settingsStorageKey, JSON.stringify(settings));
    }

    public hasKey(key: string, type: SettingsType = SettingsType.LOCAL): boolean {
        const settings = this.getList(type);

        return key in settings;
    }

    public getList(type: SettingsType) {
        const storage = this._useStorage(type);

        return JSON.parse(storage.getItem(settingsStorageKey) as string) as GlobalSettingsList;
    }

    public setList(type: SettingsType, list: GlobalSettingsList) {
        const storage = this._useStorage(type);

        storage.setItem(settingsStorageKey, JSON.stringify(list));
    }

    public static get(): Settings {
        if(!Settings._instance) Settings._instance = new Settings();

        return Settings._instance;
    }
}
