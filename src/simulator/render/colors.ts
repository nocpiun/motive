export type Color = number;

const _colors = {
    "transparent": 0xffffff,
    "white": 0xffffff,
    "black": 0x222222,
    "gray": 0xb3b3b3,
    "wood": 0xbd6f1c,
    "skyBlue": 0x7dd3fc,
};

export const colors = _colors as Record<keyof typeof _colors, Color>;
