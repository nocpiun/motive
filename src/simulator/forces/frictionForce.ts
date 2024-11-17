import type { CanvasObject } from "@/simulator/object";
import type { SupportForce } from "./supportForce";

import { Force, type IForce } from "@/simulator/force";
import { Vector } from "@/simulator/vector";

interface IFrictionForce extends IForce {
    origin: CanvasObject
}

export class FrictionForce extends Force implements IFrictionForce {
    public origin: CanvasObject;

    private readonly _maxStaticFrictionSize: number;

    private constructor(private _support: SupportForce, private readonly _friction: number) {
        super(0, 0);

        this.origin = this._support.origin;
        this._maxStaticFrictionSize = this._support.length * this._friction; // f = N * μ
    }

    public override update(self: CanvasObject) {
        super.update(self);
        
        if(self.velocity.isZero()) {
            this.x = this.y = 0;
            return;
        }

        const vertical = new Vector(-this._support.y, this._support.x).getUnitVector();
        const velocityComponent = self.velocity.getComponent(vertical);

        if(!velocityComponent.isZero()) { // Dynamic friction
            const friction = Vector.multiplyScalar(Vector.reverse(velocityComponent).getUnitVector(), this._maxStaticFrictionSize);

            this.x = friction.x;
            this.y = friction.y;

            const frictionAccelerate = Force.from(friction).getAccelerate(self.mass);
            if(Vector.multiply(Vector.add(velocityComponent, frictionAccelerate), velocityComponent) <= 0) {
                this.x = this.y = 0;
                self.velocity.x = self.velocity.y = 0;
            }
        } else { // Static friction
            const forceComponent = self.forces.getComponent(vertical);
            const friction = Vector.reverse(forceComponent);

            if(friction.length <= this._maxStaticFrictionSize) {
                this.x = friction.x;
                this.y = friction.y;
            } else { // Max static friction
                const maxFriction = Vector.multiplyScalar(friction.getUnitVector(), this._maxStaticFrictionSize);

                this.x = maxFriction.x;
                this.y = maxFriction.y;
            }
        }
    }

    /** @deprecated */
    public static override from(_arg: never): never {
        throw new Error("Cannot create a friction force via from().");
    }

    public static create(support: SupportForce, friction: number): FrictionForce {
        return new FrictionForce(support, friction);
    }
}
