"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gravity = exports.version = void 0;
exports.getVersionString = getVersionString;
exports.version = "0.1.0";
function getVersionString() {
    return "v" + exports.version + (process.env.NODE_ENV === "development" ? " (dev)" : "");
}
exports.gravity = 1;
