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
exports.Render = void 0;
const PIXI = __importStar(require("pixi.js"));
const object_1 = require("@/simulator/object");
const lifecycle_1 = require("@/common/lifecycle");
const linkedNodes_1 = require("@/common/utils/linkedNodes");
const ground_1 = require("@/simulator/objects/ground");
const event_1 = require("@/common/event");
const colors_1 = require("./colors");
class Render extends lifecycle_1.Disposable {
    constructor(canvas) {
        super();
        this.canvas = canvas;
        // events
        this._onRender = new event_1.Emitter();
        this._onRefresh = new event_1.Emitter();
        this._objects = linkedNodes_1.LinkedNodes.empty();
        this._prerenderObjects = linkedNodes_1.LinkedNodes.empty();
        this._unremovableObjects = linkedNodes_1.LinkedNodes.empty();
        this.container = new PIXI.Container({ x: 0, y: 0 });
        this.isPaused = false;
        this.isMouseMode = false;
        this.isWallMode = true;
        this._register(this.canvas.onLoad((app) => {
            this._app = app;
            // Invisible background for interactions
            const bg = new PIXI.Graphics().rect(0, 0, this.canvas.width, this.canvas.height).fill(colors_1.colors["transparent"]);
            this._app.stage.addChild(bg);
            // Container
            this.container.width = this.canvas.width;
            this.container.height = this.canvas.height;
            this._app.stage.addChild(this.container);
            this._init();
            this._initObjects();
            this._initTimer();
        }));
    }
    get stage() {
        return this._app.stage;
    }
    /**
     * Initialize the whole renderer and the system when the renderer is created,
     * adding something unremovable, such as ground etc.
     *
     * This is an **one-time** method.
     */
    _init() {
        this._unremovableObjects.push(new ground_1.Ground(this));
    }
    /** Initialize the system every time after the renderer refreshed. */
    _initObjects() {
        // this._objects.push(new Ball(100, this._app.canvas.height - Ground.GROUND_HEIGHT - 15, 15, 1, new Vector(8, 0)));
        // this._objects.push(new Ball(100, 200, 15, 1, new Vector(1, 0)));
        // this._objects.push(new Ball(170, this._app.canvas.height - Ground.GROUND_HEIGHT - 15, 15, 1, new Vector(0, 0)));
    }
    _initTimer() {
        this._app.ticker.add((ticker) => {
            this.update(ticker.deltaTime);
        });
    }
    _renderObjectList(objList, delta, hitboxTest = true) {
        for (const obj of objList) {
            obj.update(delta);
            if (!hitboxTest)
                continue;
            // Hitbox tests
            for (const _obj of this._objects) {
                if (_obj !== obj) {
                    obj.hitbox.test(_obj);
                }
            }
            // Test wall
            if (!this.isWallMode)
                return;
            const hitDirection = obj.hitbox.testWall(this.canvas);
            if (hitDirection) {
                obj.reverseVelocity(hitDirection);
            }
        }
    }
    addObject(...args) {
        const [id, ...objArgs] = args;
        const obj = (0, object_1.createObject)(id, this, ...objArgs);
        this._prerenderObjects.push(obj);
        obj.nodePtr = this._objects.push(obj);
        return obj;
    }
    deleteObject(obj) {
        obj.dispose();
        this._objects.remove(obj.nodePtr);
    }
    clearObjects() {
        this.container.removeChildren();
        for (const obj of this._prerenderObjects) {
            obj.dispose();
        }
        this._prerenderObjects.clear();
        for (const obj of this._objects) {
            obj.dispose();
        }
        this._objects.clear();
    }
    createText(text, x, y, color = colors_1.colors["black"], size = 18, italic = false) {
        return new PIXI.Text({
            text,
            x, y,
            style: {
                fontFamily: italic ? "KaTeX-Italic" : "KaTeX-Regular",
                fontSize: size,
                fontWeight: "200",
                fill: color
            }
        });
    }
    refresh() {
        this.clearObjects();
        this._initObjects();
        this._onRefresh.fire();
    }
    pause() {
        if (this.isPaused)
            return;
        this.isPaused = true;
    }
    unpause() {
        if (!this.isPaused)
            return;
        this.isPaused = false;
    }
    setMouseMode(enabled) {
        this.isMouseMode = enabled;
    }
    setWallMode(enabled) {
        this.isWallMode = enabled;
    }
    update(delta) {
        // Pre-rendering stage
        if (!this._prerenderObjects.isEmpty()) {
            this._renderObjectList(this._prerenderObjects, delta, false);
            this._prerenderObjects.clear();
        }
        // Rendering stage
        if (this.isPaused)
            return;
        // Repaint the canvas
        this.container.removeChildren();
        this._renderObjectList(this._unremovableObjects, delta);
        this._renderObjectList(this._objects, delta);
        // Display Debug Info
        if (process.env.NODE_ENV === "development") {
            const infoList = [];
            infoList.push(`Objects: ${this._objects.length}`);
            if (this.isMouseMode)
                infoList.push("MouseMode");
            if (this.isWallMode)
                infoList.push("WallMode");
            for (let i = 0; i < infoList.length; i++) {
                this.container.addChild(this.createText(infoList[i], 10, 10 + i * 20));
            }
        }
        // Fire Event
        this._onRender.fire({ delta, fps: this._app.ticker.FPS });
    }
    get onRender() {
        return this._onRender.event;
    }
    get onRefresh() {
        return this._onRefresh.event;
    }
    dispose() {
        this._app.ticker.stop();
        this.clearObjects();
        super.dispose();
    }
}
exports.Render = Render;
