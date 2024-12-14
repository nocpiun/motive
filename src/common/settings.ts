import type { InputOptions } from "@/ui/form/input/input"
import type { SwitcherOptions } from "@/ui/switcher/switcher"

interface SettingsItem<V = any> {
    name: string
    value: V
    type?: "input" | "switcher"
    controlOptions?: Omit<InputOptions, "defaultValue"> | Omit<SwitcherOptions, "defaultValue">
}

export interface GlobalSettingsItem<V = any> extends SettingsItem<V> { }
export interface ObjectSettingsItem<V = any> extends SettingsItem<V> { }

type SettingsList<I extends SettingsItem> = Record<string, I>;
export type GlobalSettingsList = SettingsList<GlobalSettingsItem>;
export type ObjectSettingsList = SettingsList<ObjectSettingsItem>;

export enum SettingsType {
    // eslint-disable-next-line no-unused-vars
    LOCAL, SESSION
}

interface ISettings {
    /**
     * Store the current settings list to the storage
     */
    synchronize(type: SettingsType): void
    /**
     * Add an item to the settings
     * 
     * @param key The globally unique key of the item
     * @param item The item to add
     * @param type The type of the settings list (local / session), "local" by default
     */
    addItem<V = any>(key: string, item: GlobalSettingsItem<V>, type?: SettingsType): void
    /**
     * Set a value of an item in the settings
     * 
     * @param key The key of the item
     * @param value The new value of the item
     * @param type The type of the settings list (local / session), "local" by default
     */
    setValue<V = any>(key: string, value: V, type?: SettingsType): void
    /**
     * Get the value of an item in the settings
     * 
     * @param key The key of the item
     * @param type The type of the settings list (local / session), "local" by default
     */
    getValue<V = any>(key: string, type?: SettingsType): V
}

const settingsStorageKey = "motive:settings";

export class Settings implements ISettings {
    private static _instance: Settings | null = null;

    private readonly _local: Storage = window.localStorage;
    private readonly _session: Storage = window.sessionStorage;

    private _localSettings: GlobalSettingsList = {};
    private _sessionSettings: GlobalSettingsList = {};

    private constructor() {
        this._localSettings = this._getSettings(SettingsType.LOCAL);
        this._sessionSettings = this._getSettings(SettingsType.SESSION);
    }

    private _getSettings(type: SettingsType): GlobalSettingsList {
        const [storage,] = this._useSpecifiedSettings(type);
        const settings = storage.getItem(settingsStorageKey);
        
        if(!settings) {
            this.synchronize(type);
            return {};
        }

        return JSON.parse(settings) as GlobalSettingsList;
    }

    private _useSpecifiedSettings(type: SettingsType): [Storage, GlobalSettingsList] {
        return [
            type === SettingsType.LOCAL ? this._local : this._session,
            type === SettingsType.LOCAL ? this._localSettings : this._sessionSettings
        ];
    }

    public synchronize(type: SettingsType) {
        const [storage, settings] = this._useSpecifiedSettings(type);

        storage.setItem(settingsStorageKey, JSON.stringify(settings));
    }

    public addItem<V = any>(key: string, item: GlobalSettingsItem<V>, type: SettingsType = SettingsType.LOCAL) {
        const [, settings] = this._useSpecifiedSettings(type);

        settings[key] = item;
        this.synchronize(type);
    }

    public setValue<V = any>(key: string, value: V, type: SettingsType = SettingsType.LOCAL) {
        const [, settings] = this._useSpecifiedSettings(type);

        settings[key].value = value;
        this.synchronize(type);
    }

    public getValue<V = any>(key: string, type: SettingsType = SettingsType.LOCAL): V {
        const [, settings] = this._useSpecifiedSettings(type);

        return (settings[key] as GlobalSettingsItem<V>).value;
    }

    public static get(): Settings {
        if(!Settings._instance) Settings._instance = new Settings();

        return Settings._instance;
    }
}
