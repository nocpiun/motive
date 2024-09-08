import type { IDisposable } from "@/common/lifecycle";

import { Provider, registerProvider } from "@/ui/provider";
import { HoverWidget, HoverWidgetPosition } from "./hoverWidget";
import { generateRandomID } from "@/utils/utils";

export interface Anchor {
    x: number
    y: number
}

export interface IHoverProvider extends IDisposable {
    createTextHoverWidget(text: string, anchor: Anchor, position: HoverWidgetPosition): HoverWidget
    createTitleTextHoverWidget(title: string, text: string, anchor: Anchor, position: HoverWidgetPosition): HoverWidget
    clearHoverWidgets(): void
}

class HoverProvider extends Provider<HoverWidget> implements IHoverProvider {

    public constructor() {
        super("hover-widget-provider");
    }

    public createTextHoverWidget(text: string, anchor: Anchor, position: HoverWidgetPosition) {
        const id = `hover.${generateRandomID()}`;
        const widget = new HoverWidget(this._providerElement, { text, anchor, position, id });

        this._registerComponent(id, widget);
        return widget;
    }

    public createTitleTextHoverWidget(title: string, text: string, anchor: Anchor, position: HoverWidgetPosition) {
        const id = `hover.${generateRandomID()}`;
        const widget = new HoverWidget(this._providerElement, { title, text, anchor, position, id });

        this._registerComponent(id, widget);
        return widget;
    }

    public clearHoverWidgets() {
        this._clearComponents();
    }
}

export const hoverProvider = registerProvider<HoverProvider, HoverWidget>(HoverProvider);
