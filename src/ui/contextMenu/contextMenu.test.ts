/* eslint-disable jest/no-conditional-expect */
import { Menu } from "lucide";

import { Component } from "@/ui/ui";

import { contextMenuProvider } from "./contextMenuProvider";
import { ContextMenu, type ContextMenuItemInfo } from "./contextMenu";

describe("context-menu-component-tests", () => {
    let counter = 0;
    const testItems: ContextMenuItemInfo[] = [
        {
            text: "Test 1",
            action: () => {
                counter = 1;
            }
        },
        {
            text: "Test 2",
            action: () => {
                counter = 2;
            }
        },
        {
            text: "Test 3",
            icon: Menu,
            action: () => {
                counter = 3;
            }
        },
        { separator: true },
        {
            text: "Test 4",
            hidden: true,
            action: () => {
                counter = 4;
            }
        }
    ];

    const contextMenu = new ContextMenu(document.body, { anchor: { x: 50, y: 40 }, position: "bottom-right", items: testItems });
    const menuElem = contextMenu.element.querySelector(".context-menu") as HTMLDivElement;

    it("context-menu-properties", () => {

        expect(menuElem).toBeDefined();

        expect(Array.from(contextMenu.element.classList)).toStrictEqual(["context-menu-backdrop"]);
        expect(menuElem.getAttribute("data-position")).toBe("bottom-right");
    });

    it("hover-widget-position", () => {
        expect(menuElem.style.top).toBe("40px");
        expect(menuElem.style.left).toBe("50px");
    });

    it("context-menu-items", () => {
        menuElem.childNodes.forEach((node, key) => {
            const itemElem = node as HTMLDivElement;

            switch(key) {
                case 0:
                    expect(itemElem.className).toBe("context-menu-item");
                    expect(itemElem.textContent).toBe("Test 1");
                    break;
                case 1:
                    expect(itemElem.className).toBe("context-menu-item");
                    expect(itemElem.textContent).toBe("Test 2");
                    break;
                case 2:
                    expect(itemElem.className).toBe("context-menu-item");
                    expect(itemElem.textContent).toBe("Test 3");
                    expect(itemElem.querySelector("svg")).toBeDefined();
                    break;
                case 3:
                    expect(itemElem.className).toBe("separator");
                    break;
                case 4:
                    expect(itemElem.className).toBe("context-menu-item");
                    expect(itemElem.textContent).toBe("Test 4");
                    break;
                default:
                    break;
            }
        });
    });

    it("context-menu-actions", () => {
        menuElem.childNodes.forEach((node, key) => {
            const itemElem = node as HTMLDivElement;

            switch(key) {
                case 0:
                    itemElem.click();
                    expect(counter).toBe(1);
                    break;
                case 1:
                    itemElem.click();
                    expect(counter).toBe(2);
                    break;
                case 2:
                    itemElem.click();
                    expect(counter).toBe(3);
                    break;
                case 3:
                    // separator cannot be clicked
                    break;
                case 4:
                    itemElem.click();
                    expect(counter).toBe(4);
                    break;
                default:
                    break;
            }
        });
    });

    it("context-menu-dispose", () => {
        contextMenu.dispose();

        expect(contextMenu.element).toBeNull();
    });
});

describe("context-menu-provider-tests", () => {
    let counter = 0;
    
    class TestComponent extends Component<HTMLDivElement, {}> {
        public constructor() {
            super(
                document.createElement("div"),
                document.body,
                {},
                {}
            );

            this.element.classList.add("test-component");

            contextMenuProvider.registerContextMenu(this, [
                {
                    text: "Test 1",
                    action: () => counter = 100
                }
            ]);
        }
    }

    it("get-context-menu-provider", () => {
        expect(contextMenuProvider).toBeDefined();
    });

    it("context-menu-of-components", () => {
        const component = new TestComponent();
        const mouseEvent = new MouseEvent("contextmenu", { bubbles: true });

        component.element.dispatchEvent(mouseEvent);

        const menuElem = document.body.querySelector(".context-menu") as HTMLDivElement;
        expect(menuElem).toBeDefined();

        const itemElem = menuElem.querySelector(".context-menu-item") as HTMLDivElement;
        expect(itemElem.textContent).toBe("Test 1");

        itemElem.click();
        expect(counter).toBe(100);
    });

    it("clear-context-menus", () => {
        contextMenuProvider.clearContextMenus();

        expect(document.getElementById("context-menu-provider").childNodes.length).toBe(0);
    });
});