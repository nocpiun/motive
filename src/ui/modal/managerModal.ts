import type { ComponentLike } from "@/ui/ui";

import { Box } from "lucide";

import { $ } from "@/common/i18n";

import { Modal } from "./modal";

export class ManagerModal extends Modal {

    public constructor(target: ComponentLike) {
        super(target, { id: "manager", title: $("modal.manager.title"), icon: Box });
    }
}
