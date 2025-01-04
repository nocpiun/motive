import type { InputOptions } from "@/ui/form/input/input";
import type { SwitcherOptions } from "@/ui/switcher/switcher";
import type { SelectOptions } from "@/ui/form/select/select";
import type { ToggleOptions } from "@/ui/toggle/toggle";

import defaultLocalSettings from "@/assets/defaultLocalSettings";
import defaultSessionSettings from "@/assets/defaultSessionSettings";

import { settingsStorageKey } from "./global";
import { deepClone } from "./utils/utils";
import { Emitter, type Event } from "./event";

export interface SettingsItem<V = any> {
    name: string
    description?: string
    value: V
    type?: "input" | "switcher" | "select" | "toggle"
    controlOptions?: (
        Omit<InputOptions, "defaultValue">
        | Omit<SwitcherOptions, "defaultValue">
        | Omit<SelectOptions, "defaultValue">
        | Omit<ToggleOptions, "defaultValue">
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

interface OnDidChangeListenerData {
    key: string
    value: any
}

interface ISettings {
    /**
     * Adds an item to the settings.
     * @param key - The key under which the item will be stored.
     * @param item - The item to be stored.
     * @param type - Optional. The type of the settings.
     */
    addItem<V = any>(key: string, item: GlobalSettingsItem<V>, type?: SettingsType): void
    /**
     * Checks if a key exists in the settings.
     * @param key - The key to check.
     * @param type - Optional. The type of the settings.
     * @returns True if the key exists, false otherwise.
     */
    hasKey(key: string, type?: SettingsType): boolean
    /**
     * Retrieves the value associated with a key.
     * @param key - The key whose value is to be retrieved.
     * @param type - Optional. The type of the settings.
     * @returns The value associated with the key.
     */
    getValue<V = any>(key: string, type?: SettingsType): V
    /**
     * Sets the value associated with a key.
     * @param key - The key whose value is to be set.
     * @param value - The value to set.
     * @param type - Optional. The type of the settings.
     */
    setValue<V = any>(key: string, value: V, type?: SettingsType): void
    /**
     * Retrieves a list of settings.
     * @param type - The type of the settings.
     * @returns A list of global settings.
     */
    getList(type: SettingsType): GlobalSettingsList
    /**
     * Stores a list of settings.
     * @param list - The list of settings to store.
     * @param type - Optional. The type of the settings.
     */
    storeList(list: GlobalSettingsList, type?: SettingsType): void

    onDidChange: Event<OnDidChangeListenerData>
}

export class Settings implements ISettings {
    // events
    private _onDidChange = new Emitter<OnDidChangeListenerData>();

    private static _instance: Settings | null = null;

    private readonly _local: Storage = window.localStorage;
    private readonly _session: Storage = window.sessionStorage;

    private _localSettings: GlobalSettingsList;
    private _sessionSettings: GlobalSettingsList;

    private constructor() {
        this._localSettings = deepClone(defaultLocalSettings);
        this._sessionSettings = deepClone(defaultSessionSettings);

        this._initializeSettings(SettingsType.LOCAL);
        this._initializeSettings(SettingsType.SESSION);
    }

    private _useSettings(type: SettingsType): [Storage, GlobalSettingsList] {
        return [
            type === SettingsType.LOCAL ? this._local : this._session,
            type === SettingsType.LOCAL ? this._localSettings : this._sessionSettings
        ];
    }

    private _initializeSettings(type: SettingsType): void {
        const [storage] = this._useSettings(type);
        const storedSettings = storage.getItem(settingsStorageKey);

        !storedSettings
        ? this._storeToStorage(type)
        : this._loadFromStorage(type);
    }

    private _loadFromStorage(type: SettingsType): void {
        const [storage, settingsList] = this._useSettings(type);
        const storedSettings = JSON.parse(storage.getItem(settingsStorageKey) || "{}");

        for(const key in storedSettings) {
            if(settingsList[key]) {
                settingsList[key].value = storedSettings[key];
            }
        }
    }

    private _storeToStorage(type: SettingsType): void {
        const [storage, settingsList] = this._useSettings(type);
        const settingsMap = Object.fromEntries(
            Object.entries(settingsList).map(([key, item]) => [key, item.value])
        );
        storage.setItem(settingsStorageKey, JSON.stringify(settingsMap));
    }

    public addItem<V = any>(key: string, item: GlobalSettingsItem<V>, type: SettingsType = SettingsType.LOCAL) {
        const [, settingsList] = this._useSettings(type);
        settingsList[key] = item;
        this._storeToStorage(type);
    }

    public hasKey(key: string, type: SettingsType = SettingsType.LOCAL) {
        const [, settingsList] = this._useSettings(type);
        return key in settingsList;
    }

    public getValue<V = any>(key: string, type: SettingsType = SettingsType.LOCAL): V {
        const [, settingsList] = this._useSettings(type);
        return settingsList[key].value as V;
    }

    public setValue<V = any>(key: string, value: V, type: SettingsType = SettingsType.LOCAL) {
        const [, settingsList] = this._useSettings(type);
        settingsList[key].value = value;
        this._storeToStorage(type);
    }

    public getList(type: SettingsType) {
        const [, settingsList] = this._useSettings(type);

        return settingsList;
    }

    public storeList(list: GlobalSettingsList, type: SettingsType = SettingsType.LOCAL) {
        const [, settingsList] = this._useSettings(type);
        const oldSettingsList = deepClone(settingsList);

        Object.assign(settingsList, list);
        this._storeToStorage(type);

        for(const key in list) {
            const isChanged = oldSettingsList[key].value !== list[key].value;

            if(isChanged) {
                this._onDidChange.fire({ key, value: list[key].value });
            }
        }
    }

    public get onDidChange() {
        return this._onDidChange.event;
    }

    public static get(): Settings {
        if (!Settings._instance) Settings._instance = new Settings();
        return Settings._instance;
    }
}
