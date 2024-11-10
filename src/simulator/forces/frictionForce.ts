import type { CanvasObject } from "@/simulator/object";
import type { SupportForce } from "./supportForce";

import { Force, type IForce } from "@/simulator/force";

interface IFrictionForce extends IForce {
    origin: CanvasObject
}

export class FrictionForce extends Force implements IFrictionForce {
    public origin: CanvasObject;

    private readonly _maxStaticFrictionSize: number;

    private constructor(support: SupportForce, private readonly friction: number) {
        super(0, 0);

        this.origin = support.origin;
        this._maxStaticFrictionSize = support.length * this.friction;
    }

    public override update(self: CanvasObject) {
        super.update(self);

        /** @todo */
    }

    /** @deprecated */
    public static override from(_arg: never): never {
        throw new Error("Cannot create a friction force via from().");
    }

    public static create(support: SupportForce, friction: number): FrictionForce {
        return new FrictionForce(support, friction);
    }
}
