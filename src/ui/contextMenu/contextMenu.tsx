import type { Anchor } from "@/ui/provider";

import { createElement as createLucide, type IconNode } from "lucide";

import { Component, type ComponentLike, type IComponent } from "@/ui/ui";
import { generateRandomID } from "@/common/utils/utils";
import { Emitter, type Event } from "@/common/event";

import { contextMenuProvider } from "./contextMenuProvider";
import "./contextMenu.less";

export type ContextMenuPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface ContextMenuItemInfo {
    text?: string
    icon?: IconNode
    subItems?: ContextMenuItemInfo[]
    separator?: boolean
    hidden?: boolean
    
    action?: () => void
}

export interface ContextMenuOptions {
    id?: string
    anchor: Anchor
    position: ContextMenuPosition
    items: ContextMenuItemInfo[]
}

const defaultOptions: ContextMenuOptions = {
    anchor: {
        x: 0,
        y: 0
    },
    position: "bottom-right",
    items: []
};

export interface IContextMenu extends IComponent {
    id?: string
}

export class ContextMenu extends Component<HTMLDivElement, ContextMenuOptions> implements IContextMenu {
    private _contextMenuElem: HTMLDivElement;
    
    public constructor(target: ComponentLike, _options?: ContextMenuOptions) {
        super(
            (
                <div className="context-menu-backdrop">
                    <div className="context-menu" data-position={_options.position}/>
                </div>
            ),
            target,
            defaultOptions,
            _options
        );

        this._contextMenuElem = this._element.querySelector(".context-menu") as HTMLDivElement;

        if(this._options.id) this._element.id = this._options.id;

        for(const info of this._options.items) {
            if(info.hidden) continue;

            info.separator
            ? this._createSeparator()
            : this._createItem(info);
        }

        const width = this._contextMenuElem.clientWidth;
        const height = this._contextMenuElem.clientHeight;

        switch(this._options.position) {
            case "top-left":
                this._contextMenuElem.style.left = (this._options.anchor.x - width) +"px";
                this._contextMenuElem.style.top = (this._options.anchor.y - height) +"px";
                break;
            case "top-right":
                this._contextMenuElem.style.left = this._options.anchor.x +"px";
                this._contextMenuElem.style.top = (this._options.anchor.y - height) +"px";
                break;
            case "bottom-left":
                this._contextMenuElem.style.left = (this._options.anchor.x - width) +"px";
                this._contextMenuElem.style.top = this._options.anchor.y +"px";
                break;
            case "bottom-right":
                this._contextMenuElem.style.left = this._options.anchor.x +"px";
                this._contextMenuElem.style.top = this._options.anchor.y +"px";
                break;
        }

        // Remove the context menu when the user clicks outside
        this._element.addEventListener("mousedown", (e) => {
            if(e.target === this._element) contextMenuProvider.clearContextMenus();
        });
        window.addEventListener("blur", () => contextMenuProvider.clearContextMenus());
    }

    private _createItem(info: ContextMenuItemInfo): void {
        const item = new ContextMenuItem(this._contextMenuElem, {
            ...info,
            id: `${this._options.id}.${generateRandomID()}`
        });

        this._register(item);
        if(info.action) this._register(item.onClick(() => info.action()));
    }

    private _createSeparator(): void {
        const item = new ContextMenuItem(this._contextMenuElem, {
            separator: true,
            id: `${this._options.id}.${generateRandomID()}`
        });

        this._register(item);
    }

    public get id() {
        return this._options.id;
    }
}

interface ContextMenuItemOptions extends Omit<ContextMenuItemInfo, "hidden" | "action"> {
    id?: string
}

const itemDefaultOptions: ContextMenuItemOptions = {
    text: "",
    subItems: [],
    separator: false
};

interface IContextMenuItem extends IComponent {
    id?: string

    onClick: Event<void>
}

class ContextMenuItem extends Component<HTMLDivElement, ContextMenuItemOptions> implements IContextMenuItem {
    // events
    private _onClick = new Emitter();

    public constructor(target: ComponentLike, _options?: ContextMenuItemOptions) {
        super(
            (
                <div className="context-menu-item">
                    {!_options.separator && (
                        <>
                            <div className="icon-wrapper">
                                {_options.icon && createLucide(_options.icon)}
                            </div>
                            <button>{_options.text}</button>
                        </>
                    )}
                </div>
            ),
            target,
            itemDefaultOptions,
            _options
        );

        if(this._options.separator) this._element.className = "separator";
        if(this._options.id) this._element.id = this._options.id;

        /** @todo Register sub items */

        this._register(this._onClick);
        
        if(!this._options.separator) this._element.addEventListener("click", () => {
            this._onClick.fire();
            contextMenuProvider.clearContextMenus();
        });
    }

    public get id() {
        return this._options.id;
    }

    public get onClick() {
        return this._onClick.event;
    }
}
