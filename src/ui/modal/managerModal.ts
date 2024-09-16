import type { ComponentLike } from "@/ui/ui";

import { Modal } from "./modal";

export class ManagerModal extends Modal {

    public constructor(target: ComponentLike) {
        super(target, { id: "manager", title: "管理" });
    }
}
