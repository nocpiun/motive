import type { ComponentLike } from "@/ui/ui";

import { BookMarked, HandCoins } from "lucide";

import { version } from "@/common/global";

import { Modal } from "./modal";

export class AboutModal extends Modal {

    public constructor(target: ComponentLike) {
        super(target, { id: "about", title: "关于" });

        this._addFooterButton("donate", { text: "打赏", variant: "primary", icon: HandCoins }, "left");
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
        document.querySelector(".info-list-container")?.appendChild(
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
