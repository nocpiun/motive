"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hoverProvider = void 0;
const provider_1 = require("@/ui/provider");
const utils_1 = require("@/common/utils/utils");
const hoverWidget_1 = require("./hoverWidget");
class HoverProvider extends provider_1.Provider {
    constructor() {
        super("hover-widget-provider");
    }
    createTextHoverWidget(text, anchor, position) {
        const id = `hover.${(0, utils_1.generateRandomID)()}`;
        const widget = new hoverWidget_1.HoverWidget(this._providerElement, { text, anchor, position, id });
        this._registerComponent(id, widget);
        return widget;
    }
    createTitleTextHoverWidget(title, text, anchor, position) {
        const id = `hover.${(0, utils_1.generateRandomID)()}`;
        const widget = new hoverWidget_1.HoverWidget(this._providerElement, { title, text, anchor, position, id });
        this._registerComponent(id, widget);
        return widget;
    }
    clearHoverWidgets() {
        this._clearComponents();
    }
}
exports.hoverProvider = (0, provider_1.registerProvider)(HoverProvider);
