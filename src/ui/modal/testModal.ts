import type { ComponentLike } from "@/ui/ui";

import { Modal } from "./modal";

interface TestModalData {
    num?: number
}

/**
 * A modal dialog for testing. Only used in test environment.
 */
export class TestModal extends Modal<TestModalData> {
    public data: TestModalData;

    public constructor(target: ComponentLike) {
        if(process.env.NODE_ENV !== "test") {
            throw new Error("TestModal can only be used in test environment.");
        }
        
        super(target, { id: "test", title: "Test Modal", width: 300, height: 200 });
        
        this._addFooterButton("test-btn-1", { text: "Test Footer Button 1" }, "right", () => {});
        this._addFooterButton("test-btn-2", { text: "Test Footer Button 2" }, "left", () => {});

        this._register(this.onShow((data) => {
            this.data = data;
        }));
    }

    public changeTitle(): void {
        this._setTitle("Changed Test Modal");
    }
}
