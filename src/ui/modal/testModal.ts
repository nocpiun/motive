import { ComponentLike } from "@/ui/ui";
import { Modal } from "./modal";

/**
 * A modal dialog for testing. Only used in test environment.
 */
export class TestModal extends Modal {

    public constructor(target: ComponentLike) {
        super(target, { id: "test", title: "Test Modal" });
    }
}
