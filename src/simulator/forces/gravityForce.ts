import type { CanvasObject } from "@/simulator/object";

import { Force, type IForce } from "@/simulator/force";
import { Settings } from "@/common/settings";

interface IGravityForce extends IForce {
    
}

export class GravityForce extends Force implements IGravityForce {
    
    public constructor(mass: number) {
        const g = Settings.get().getValue("gravity") as number;

        super(0, -mass * g);
    }

    public override update(self: CanvasObject) {
        super.update(self);

        const g = Settings.get().getValue("gravity") as number;
        
        // To update gravity when the user changes the gravity accerlerate in the settings
        this.y = -self.mass * g;
    }
}
