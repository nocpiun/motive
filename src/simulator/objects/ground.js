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
exports.Ground = void 0;
const PIXI = __importStar(require("pixi.js"));
const object_1 = require("@/simulator/object");
const colors_1 = require("@/simulator/render/colors");
const vector_1 = require("@/simulator/vector");
const groundHitbox_1 = require("@/simulator/hitboxes/groundHitbox");
const force_1 = require("@/simulator/force");
const ball_1 = require("./ball");
const block_1 = require("./block");
class Ground extends object_1.CanvasObject {
    constructor(render) {
        super(render, new PIXI.Graphics(), // to be painted in _initTexture()
        Infinity, vector_1.Vector.Zero, new groundHitbox_1.GroundHitbox({ x: 0, y: render.canvas.height - Ground.GROUND_HEIGHT }));
        this.normalVector = new vector_1.Vector(0, 1);
        // Ground texture
        this._initTexture();
        this._register(this.hitbox.onHit(({ obj }) => {
            if (obj instanceof ball_1.Ball) {
                // To prevent the object from going through the ground
                obj.obj.y = this.hitbox.anchor.y - obj.radius;
                obj.updateHitboxAnchor();
                const vy = obj.velocity.getComponent(this.normalVector);
                if (vy.length > Ground.STABLE_VELOCITY) {
                    obj.reverseVelocity("y", Ground.DAMPING);
                }
                else {
                    obj.velocity.y = 0;
                    obj.applyForce("ground.support", force_1.Force.reverse(force_1.Force.gravity(obj.mass)));
                }
            }
            else if (obj instanceof block_1.Block) {
                // To prevent the object from going through the ground
                obj.obj.y = this.hitbox.anchor.y - obj.size;
                obj.updateHitboxAnchor();
                obj.velocity.y = 0;
                obj.applyForce("ground.support", force_1.Force.reverse(force_1.Force.gravity(obj.mass)));
            }
        }));
        this._register(this.render.onRefresh(() => {
            this._initTexture();
        }));
        window.addEventListener("resize", () => {
            this._initTexture();
        });
    }
    _initTexture() {
        const canvasWidth = this.render.canvas.width;
        const canvasHeight = this.render.canvas.height;
        const spacing = 10;
        const lineWidth = 2;
        const length = 13;
        const angle = Math.PI / 4;
        const y = canvasHeight - Ground.GROUND_HEIGHT;
        const obj = this.obj;
        obj.clear();
        // Horizontal line
        obj.moveTo(0, canvasHeight - Ground.GROUND_HEIGHT)
            .lineTo(canvasWidth, canvasHeight - Ground.GROUND_HEIGHT)
            .stroke({ width: 4, color: colors_1.colors["black"] });
        // Texture lines
        for (let x = 0; x <= canvasWidth; x += spacing) {
            obj.moveTo(x, y)
                .lineTo(x - length * Math.sin(angle), y + length * Math.cos(angle))
                .stroke({ width: lineWidth, color: colors_1.colors["black"] });
        }
    }
    update(delta) {
        super.update(delta);
    }
}
exports.Ground = Ground;
Ground.id = "ground";
Ground.GROUND_HEIGHT = 50;
Ground.DAMPING = .9;
Ground.STABLE_VELOCITY = 5;
(0, object_1.registerObject)(Ground.id, Ground);
