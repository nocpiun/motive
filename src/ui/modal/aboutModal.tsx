import type { ComponentLike } from "@/ui/ui";

import { BookMarked, HandCoins, SquareArrowOutUpRight } from "lucide";

import { getVersionString, version } from "@/common/global";
import { $ } from "@/common/i18n";

import { Modal } from "./modal";

export class AboutModal extends Modal {

    public constructor(target: ComponentLike) {
        super(target, { id: "about", title: $("modal.about.title") });

        this._addFooterButton(
            "donate",
            {
                text: $("modal.about.ctx.donate"),
                variant: "primary",
                icon: HandCoins,
                contextMenuItems: [
                    {
                        text: $("modal.about.ctx.donate"),
                        icon: HandCoins,
                        action: () => window.open("https://github.com/sponsors/nocpiun", "_blank")
                    },
                    { separator: true },
                    {
                        text: $("modal.about.ctx.donate.links"),
                        subItems: [
                            {
                                text: $("modal.about.ctx.donate.links.repo"),
                                icon: SquareArrowOutUpRight,
                                action: () => window.open("https://github.com/nocpiun/motive", "_blank")
                            },
                            {
                                text: $("modal.about.ctx.donate.links.homepage"),
                                icon: SquareArrowOutUpRight,
                                action: () => window.open("https://github.com/NriotHrreion", "_blank")
                            },
                            {
                                text: $("modal.about.ctx.donate.links.website"),
                                icon: SquareArrowOutUpRight,
                                action: () => window.open("https://nocp.space", "_blank")
                            }
                        ]
                    }
                ]
            },
            "left",
            () => {
                window.open("https://nocp.space/donate", "_blank");
            }
        );
        this._addFooterButton("changelog", { text: $("modal.about.changelog"), variant: "secondary", icon: BookMarked });

        // UI

        this._container.appendChild(
            <div className="basic-info-container">
                <div className="title-container">
                    <h2>{$("app.name")}</h2>
                    <span className="version-number">v{version}</span>
                </div>
                <div className="copyright-container">
                    <span>By Nocpiun Org / Copyright (c) {new Date().getFullYear()} NriotHrreion</span>
                </div>
            </div>
        );

        this._container.appendChild(<div className="info-list-container"/>);

        this._addInfoListItem($("modal.about.version"), getVersionString());
        this._addInfoListItem($("modal.about.repo"), "nocpiun/motive", "https://github.com/nocpiun/motive");
        this._addInfoListItem($("modal.about.license"), "MPL-2.0 License");
    }

    private _addInfoListItem(name: string, content: string, link?: string): void {
        this._container.querySelector(".info-list-container")?.appendChild(
            <div className="info-list-item">
                <span className="info-list-item-name">{name}</span>
                {
                    link
                    ? <a className="info-list-item-content" href={link} target="_blank" rel="noreferrer">{content}</a>
                    : <span className="info-list-item-content">{content}</span>
                }
            </div>
        );
    }
}
