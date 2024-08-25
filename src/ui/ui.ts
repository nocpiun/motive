import { IDisposable } from "@/common/lifecycle";

export interface IComponent extends IDisposable {
    element: HTMLElement
}
