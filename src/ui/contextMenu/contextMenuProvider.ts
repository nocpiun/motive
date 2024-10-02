import type { IDisposable } from "@/common/lifecycle";

import { type Anchor, Provider, registerProvider } from "@/ui/provider";
import { generateRandomID } from "@/common/utils/utils";
import { Component, type ComponentLike } from "@/ui/ui";

import { ContextMenu, type ContextMenuItemInfo, type ContextMenuPosition } from "./contextMenu";

export interface IContextMenuProvider extends IDisposable {
    /**
     * Reigster a new context menu to an element or a component
     * 
     * @param target The element that registers the context menu
     * @param items Items of the context menu
     */
    registerContextMenu(target: ComponentLike, items: ContextMenuItemInfo[]): void
    /**
     * Clear and dispose all context menus
     */
    clearContextMenus(): void
}

class ContextMenuProvider extends Provider<ContextMenu> implements IContextMenuProvider {

    public constructor() {
        super("context-menu-provider");
    }

    private _createContextMenu(items: ContextMenuItemInfo[], anchor: Anchor, position: ContextMenuPosition) {
        const id = `context-menu.${generateRandomID()}`;
        const menu = new ContextMenu(this._providerElement, { items, anchor, position, id });

        this._registerComponent(id, menu);
        return menu;
    }
    
    public registerContextMenu(target: ComponentLike, items: ContextMenuItemInfo[]): void {
        if(items.length === 0) throw new Error("The context menu must have at least one item.");

        (
            (target instanceof Component ? target.element : target) as HTMLElement
        ).addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();

            this.clearContextMenus();
            this._createContextMenu(items, {
                x: e.clientX,
                y: e.clientY
            }, "top-right");
        });
    }

    public clearContextMenus() {
        this._clearComponents();
    }
}

export const contextMenuProvider = registerProvider<ContextMenuProvider, ContextMenu>(ContextMenuProvider);