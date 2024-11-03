"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ball = void 0;
const PIXI = __importStar(require("pixi.js"));
const object_1 = require("@/simulator/object");
const colors_1 = require("@/simulator/render/colors");
const vector_1 = require("@/simulator/vector");
const roundHitbox_1 = require("@/simulator/hitboxes/roundHitbox");
const ground_1 = require("./ground");
class Ball extends object_1.CanvasObject {
    constructor(render, x, y, radius = 15, mass = 1, velocity = vector_1.Vector.Zero) {
        super(render, new PIXI.Graphics()
            .circle(0, 0, radius)
            .fill(colors_1.colors["black"]), mass, velocity, new roundHitbox_1.RoundHitbox(radius, { x, y }));
        this.radius = radius;
        this.obj.position.set(x, y);
        this._enableInteractivity();
        this._enableSettings(Ball.id, () => ({
            name: {
                name: "名称",
                value: this._name,
                controlOptions: {
                    type: "text",
                    maxLength: 1
                }
            },
            mass: {
                name: "质量",
                value: this.mass,
                controlOptions: {
                    type: "number"
                }
            }
        }));
        this.applyGravity();
        this._register(this.hitbox.onHit(({ obj, depth }) => {
            if (obj instanceof Ball) {
                obj.hitbox.cancelNextTest();
                /**
                 * To prevent balls from going through each other
                 */
                const p1 = this.hitbox.anchor;
                const p2 = obj.hitbox.anchor;
                const movement = vector_1.Vector.multiplyScalar(vector_1.Vector.fromPoints(p1, p2).getUnitVector(), depth);
                this.obj.x -= movement.x / 2;
                this.obj.y -= movement.y / 2;
                obj.obj.x += movement.x / 2;
                obj.obj.y += movement.y / 2;
                this.updateHitboxAnchor();
                obj.updateHitboxAnchor();
                /**
                 * Calculate new velocities (elastic collision)
                 *
                 * v1' = ((m1 - m2) * v1) / (m1 + m2) + (2 * m2 * v2) / (m1 + m2)
                 * v2' = ((m2 - m1) * v2) / (m1 + m2) + (2 * m1 * v1) / (m1 + m2)
                 */
                /** *m1 + m2* */
                const massSum = this.mass + obj.mass;
                /** *m1 - m2* */
                const massDiff = this.mass - obj.mass;
                /** *((m2 - m1) v2) / (m1 + m2)* */
                const va = vector_1.Vector.multiplyScalar(obj.velocity, -massDiff / massSum);
                /** *(2 m1 v1) / (m1 + m2)* */
                const vb = vector_1.Vector.multiplyScalar(this.velocity, (2 * this.mass) / massSum);
                /** *((m1 - m2) v1) / (m1 + m2)* */
                const vc = vector_1.Vector.multiplyScalar(this.velocity, massDiff / massSum);
                /** *(2 m2 v2) / (m1 + m2)* */
                const vd = vector_1.Vector.multiplyScalar(obj.velocity, (2 * obj.mass) / massSum);
                obj.velocity = vector_1.Vector.add(va, vb); // v2'
                this.velocity = vector_1.Vector.add(vc, vd); // v1'
            }
        }));
        this._register(this.onPointerUp(({ velocity }) => {
            this.velocity = velocity;
        }));
        this._register(this.onSettingsSave((settings) => {
            this.setName(settings["name"].value);
            this.setMass(settings["mass"].value);
        }));
    }
    update(delta) {
        super.update(delta);
        if (this.obj.y < this.render.canvas.height - ground_1.Ground.GROUND_HEIGHT - this.radius * 2) {
            this.removeForce("ground.support");
        }
        this._drawName(0, 0);
    }
}
exports.Ball = Ball;
Ball.id = "ball";
(0, object_1.registerObject)(Ball.id, Ball);
