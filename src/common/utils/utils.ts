import type { Point } from "@/simulator/render/render";

export function getRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomID(length: number = 6): string {
    const chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    let id = "";

    for(let i = 0; i < length; i++) {
        id += chars[getRandom(0, chars.length - 1)];
    }

    return id;
}

export function getPointDistance(point1: Point, point2: Point): number {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

export function deepClone<T>(obj: T): T {
    if(obj === null || typeof obj !== "object") {
        return obj;
    }

    if(obj instanceof Date) {
        return new Date(obj.getTime()) as any;
    }

    if(obj instanceof Array) {
        const arrCopy = [] as any[];
        obj.forEach((_, i) => {
            arrCopy[i] = deepClone(obj[i]);
        });
        return arrCopy as any;
    }

    if(obj instanceof Object) {
        const objCopy = {} as { [key: string]: any };
        Object.keys(obj).forEach((key) => {
            objCopy[key] = deepClone((obj as { [key: string]: any })[key]);
        });
        return objCopy as T;
    }

    throw new Error("The type of the object is not supported.");
}
