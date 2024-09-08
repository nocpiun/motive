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
