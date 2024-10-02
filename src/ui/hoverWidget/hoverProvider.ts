import type { IDisposable } from "@/common/lifecycle";
import type { Anchor } from "@/ui/provider";

import { Provider, registerProvider } from "@/ui/provider";
import { generateRandomID } from "@/common/utils/utils";

import { HoverWidget, type HoverWidgetPosition } from "./hoverWidget";

export interface IHoverProvider extends IDisposable {
    /**
     * Create a text-only hover widget and display it
     * 
     * @param text Hover text
     * @param anchor The anchor point of the widget
     * @param position The position of the widget
     */
    createTextHoverWidget(text: string, anchor: Anchor, position: HoverWidgetPosition): HoverWidget
    /**
     * Create a hover widget that contains a title and text, and display it
     * 
     * @param title Hover title
     * @param text Hover text
     * @param anchor The anchor point of the widget
     * @param position The position of the widget
     */
    createTitleTextHoverWidget(title: string, text: string, anchor: Anchor, position: HoverWidgetPosition): HoverWidget
    /**
     * Clear and dispose all hover widgets
     */
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
