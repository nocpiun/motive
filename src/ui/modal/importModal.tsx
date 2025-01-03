import type { ComponentLike } from "@/ui/ui";
import type { Button } from "@/ui/button/button";
import type { Render } from "@/simulator/render/render";

import { Import } from "lucide";

import { Executor, MOTC } from "@/motc";
import { $ } from "@/common/i18n";

import { Modal } from "./modal";

const inputLabelText = $("modal.import.label");

interface ImportModalData {
    renderer: Render
}

export class ImportModal extends Modal<ImportModalData> {
    private _renderer: Render | null = null;
    private _rawMot: string | null = null;

    private _clearButton: Button;
    private _loadButton: Button;
    private _inputLabel: HTMLLabelElement;
    private _inputElem: HTMLInputElement;

    public constructor(target: ComponentLike) {
        super(target, { id: "import", title: $("modal.import.title"), icon: Import });

        this._loadButton = this._addFooterButton("load", { text: $("modal.import.load"), variant: "success", icon: Import, disabled: true }, "right", () => this._loadFile());
        this._clearButton = this._addFooterButton("clear", { text: $("modal.import.clear"), disabled: true }, "right", () => this._clear());

        // UI

        const inputContainer = this._container.appendChild(<div className="file-input-container"/>);
        this._inputLabel = inputContainer.appendChild(
            <label>
                <span className="file-input-label">{inputLabelText}</span>
            </label>
        );
        this._inputElem = this._inputLabel.appendChild(<input type="file" accept=".mot" multiple="false"/>);

        this._inputElem.addEventListener("change", async () => {
            if(this._inputElem.files.length === 0) return;

            this._importFile(this._inputElem.files![0]);
        });

        this._inputLabel.addEventListener("drop", (e: DragEvent) => {
            e.preventDefault();

            this._importFile(e.dataTransfer.files![0]);
        });

        this._inputLabel.addEventListener("dragover", (e: DragEvent) => e.preventDefault());

        this._register(this.onShow(({ renderer }) => {
            this._renderer = renderer;
        }));

        this._register(this.onClose(() => {
            this._clear();
        }));
    }

    private async _importFile(motFile: File): Promise<void> {
        // convert to string
        this._rawMot = await motFile.text();
        this._setLabel(motFile.name, true);
        this._clearButton.disabled = this._loadButton.disabled = false;
    }

    private _loadFile(): void {
        if(!this._renderer) throw new Error("No renderer is provided.");
        if(!this._rawMot) throw new Error("No mot file to load.");

        const parsed = MOTC.parse(this._rawMot);
        const executor = new Executor(this._renderer);
        executor.execute(parsed);
    }

    private _clear(): void {
        this._rawMot = null;
        this._inputElem.value = "";
        this._setLabel(inputLabelText);
        this._clearButton.disabled = this._loadButton.disabled = true;
    }

    private _setLabel(text: string, active: boolean = false): void {
        const elem = this._inputLabel.getElementsByClassName("file-input-label")[0] as HTMLSpanElement;
        
        if(active && !elem.classList.contains("active")) {
            elem.classList.add("active");
        } else if(!active) {
            elem.classList.remove("active");
        }

        elem.textContent = text;
    }
}
