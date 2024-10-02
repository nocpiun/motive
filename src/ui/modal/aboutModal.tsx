import type { ComponentLike } from "@/ui/ui";

import { BookMarked, HandCoins, SquareArrowOutUpRight } from "lucide";

import { version } from "@/common/global";

import { Modal } from "./modal";

export class AboutModal extends Modal {

    public constructor(target: ComponentLike) {
        super(target, { id: "about", title: "关于" });

        this._addFooterButton(
            "donate",
            {
                text: "打赏",
                variant: "primary",
                icon: HandCoins,
                contextMenuItems: [
                    {
                        text: "打赏",
                        icon: HandCoins,
                        action: () => window.open("https://github.com/sponsors/nocpiun", "_blank")
                    },
                    { separator: true },
                    {
                        text: "项目 Github 仓库",
                        icon: SquareArrowOutUpRight,
                        action: () => window.open("https://github.com/nocpiun/motive", "_blank")
                    },
                    {
                        text: "作者 Github 主页",
                        icon: SquareArrowOutUpRight,
                        action: () => window.open("https://github.com/NriotHrreion", "_blank")
                    },
                    {
                        text: "作者个人网站",
                        icon: SquareArrowOutUpRight,
                        action: () => window.open("https://nin.red", "_blank")
                    }
                ]
            },
            "left",
            () => {
                window.open("https://nin.red/donate", "_blank");
            }
        );
        this._addFooterButton("changelog", { text: "更新日志", variant: "secondary", icon: BookMarked });

        // UI

        this._container.appendChild(
            <div className="basic-info-container">
                <div className="title-container">
                    <h2>Motive</h2>
                    <span className="version-number">v{version}</span>
                </div>
                <div className="copyright-container">
                    <span>By Nocpiun Org / Copyright (c) {new Date().getFullYear()} NriotHrreion</span>
                </div>
            </div>
        );

        this._container.appendChild(<div className="info-list-container"/>);

        this._addInfoListItem("版本", version);
        this._addInfoListItem("Github 仓库", "nocpiun/motive", "https://github.com/nocpiun/motive");
        this._addInfoListItem("许可", "MPL-2.0 License");
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
