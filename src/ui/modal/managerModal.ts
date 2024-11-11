import type { ComponentLike } from "@/ui/ui";

import { $ } from "@/common/i18n";

import { Modal } from "./modal";

export class ManagerModal extends Modal {

    public constructor(target: ComponentLike) {
        super(target, { id: "manager", title: $("modal.manager.title") });
    }
}
