"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerModal = void 0;
const modal_1 = require("./modal");
class ManagerModal extends modal_1.Modal {
    constructor(target) {
        super(target, { id: "manager", title: "管理" });
    }
}
exports.ManagerModal = ManagerModal;
