import type { Anchor } from "@/ui/provider";

import { ChevronRight, createElement as createLucide, type IconNode } from "lucide";

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
    isSubMenu?: boolean
    items: ContextMenuItemInfo[]
}

const defaultOptions: ContextMenuOptions = {
    anchor: {
        x: 0,
        y: 0
    },
    position: "bottom-right",
    isSubMenu: false,
    items: []
};

export interface IContextMenu extends IComponent {
    setPosition(position: ContextMenuPosition): void

    id?: string
}

export class ContextMenu extends Component<HTMLDivElement, ContextMenuOptions> implements IContextMenu {
    
    public constructor(target: ComponentLike, _options?: ContextMenuOptions) {
        super(
            (
                <div className="context-menu" data-position={_options.position}/>
            ),
            target,
            defaultOptions,
            _options
        );

        if(this._options.id) this._element.id = this._options.id;

        for(const info of this._options.items) {
            if(info.hidden) continue;

            info.separator
            ? this._createSeparator()
            : this._createItem(info);
        }

        this.setPosition(this._options.position);

        // Remove the context menu when the user clicks outside
        document.body.addEventListener("mousedown", (e) => {
            if(!(e.target as HTMLElement).closest(".context-menu")) {
                contextMenuProvider.clearContextMenus();
            }
        });
        window.addEventListener("blur", () => contextMenuProvider.clearContextMenus());
    }

    private _createItem(info: ContextMenuItemInfo): void {
        const item = new ContextMenuItem(this._element, {
            ...info,
            id: `${this._options.id}.${generateRandomID()}`,
            parentMenu: this
        });

        this._register(item);
        if(info.action) {
            this._register(item.onClick(() => info.action()));
        }
    }

    private _createSeparator(): void {
        const item = new ContextMenuItem(this._element, {
            separator: true,
            id: `${this._options.id}.${generateRandomID()}`,
            parentMenu: this
        });

        this._register(item);
    }

    public setPosition(position: ContextMenuPosition) {
        this._options.position = position;

        const width = this.width;
        const height = this.height;

        switch(position) {
            case "top-left":
                this._element.style.left = (this._options.anchor.x - width) +"px";
                this._element.style.top = (this._options.anchor.y - height) +"px";
                break;
            case "top-right":
                this._element.style.left = this._options.anchor.x +"px";
                this._element.style.top = (this._options.anchor.y - height) +"px";
                break;
            case "bottom-left":
                this._element.style.left = (this._options.anchor.x - width) +"px";
                this._element.style.top = this._options.anchor.y +"px";
                break;
            case "bottom-right":
                this._element.style.left = this._options.anchor.x +"px";
                this._element.style.top = this._options.anchor.y +"px";
                break;
        }
    }

    public get width() {
        return this._element.clientWidth;
    }

    public get height() {
        return this._element.clientHeight;
    }

    public get id() {
        return this._options.id;
    }
}

interface ContextMenuItemOptions extends Omit<ContextMenuItemInfo, "hidden" | "action"> {
    id?: string
    parentMenu: ContextMenu
}

const itemDefaultOptions: ContextMenuItemOptions = {
    text: "",
    subItems: [],
    separator: false,
    parentMenu: null
};

interface IContextMenuItem extends IComponent {
    id?: string

    onClick: Event<void>
}

class ContextMenuItem extends Component<HTMLDivElement, ContextMenuItemOptions> implements IContextMenuItem {
    // events
    private _onClick = new Emitter();

    private _subItems?: ContextMenuItemInfo[];
    private _subMenuContainer: HTMLDivElement;
    private _subMenu: ContextMenu | null = null;

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
                            {
                                (_options.subItems && _options.subItems.length > 0) && (
                                    <div className="icon-wrapper">
                                        {createLucide(ChevronRight)}
                                    </div>
                                )
                            }
                            <div className="sub-context-menu-container"/>
                        </>
                    )}
                </div>
            ),
            target,
            itemDefaultOptions,
            _options
        );

        this._subMenuContainer = this._element.querySelector(".sub-context-menu-container");

        if(this._options.subItems && this._options.subItems.length > 0) this._subItems = this._options.subItems;
        if(this._options.separator) this._element.className = "separator";
        if(this._options.id) this._element.id = this._options.id;

        this._register(this._onClick);

        if(this._subItems) {
            this._register(this.onHover(() => this._createSubContextMenu()));
            this._register(this.onUnhover((e) => {
                const rect = this._element.getBoundingClientRect();
                const x = e.clientX - rect.left;

                // Only when the mouse moves out from the right side of the menu,
                // do not close the sub context menu
                if(x <= rect.width) this._closeSubContextMenu();
            }));
        }
        
        if(!this._options.separator && !this._subItems) {
            this._element.addEventListener("click", (e) => {
                e.stopPropagation();

                this._onClick.fire();
                contextMenuProvider.clearContextMenus();
            });
        }
    }

    private _createSubContextMenu(): void {
        if(this._subMenu) return;

        const parentRect = this._options.parentMenu.element.getBoundingClientRect();

        this._subMenu = new ContextMenu(this._subMenuContainer, {
            items: this._subItems,
            position: "bottom-right",
            anchor: {
                x: parentRect.width - this._element.offsetLeft,
                y: 0
            },
            isSubMenu: true
        });
    }

    private _closeSubContextMenu(): void {
        if(!this._subMenu) return;

        this._subMenu.dispose();
        this._subMenu = null;
    }

    public get id() {
        return this._options.id;
    }

    public get onClick() {
        return this._onClick.event;
    }
}
