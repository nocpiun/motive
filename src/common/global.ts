export const version = "0.1.0";
export function getVersionString(): string {
    return "v"+ version + (process.env.NODE_ENV === "development" ? " (dev)" : "")
}

export const settingsStorageKey = "motive:settings";
