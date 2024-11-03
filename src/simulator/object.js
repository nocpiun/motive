"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasObject = void 0;
exports.registerObject = registerObject;
exports.createObject = createObject;
const event_1 = require("@/common/event");
const lifecycle_1 = require("@/common/lifecycle");
const modalProvider_1 = require("@/ui/modal/modalProvider");
const vector_1 = require("./vector");
const force_1 = require("./force");
const colors_1 = require("./render/colors");
class CanvasObject extends lifecycle_1.Disposable {
    constructor(render, obj, mass, velocity, hitbox) {
        super();
        this.render = render;
        this.obj = obj;
        this.mass = mass;
        this.velocity = velocity;
        this.hitbox = hitbox;
        // events
        this._onPointerDown = new event_1.Emitter();
        this._onPointerMove = new event_1.Emitter();
        this._onPointerUp = new event_1.Emitter();
        this._onSettingsSave = new event_1.Emitter();
        this._forces = new force_1.ForceCollection();
        this._isInteractive = false;
        this._isHeld = false;
        this._mousePoint = null;
        this._mouseMovingTime = null;
        this._mouseVelocity = null;
        this._register(this.hitbox);
    }
    _enableInteractivity() {
        this.obj.interactive = true;
        this._isInteractive = true;
        this.obj.on("pointerdown", (e) => {
            if (!this.render.isMouseMode)
                return;
            if (!this._isHeld) {
                this._isHeld = true;
                const position = this.render.container.toLocal(e.global);
                this.velocity = vector_1.Vector.Zero;
                this.obj.x = position.x;
                this.obj.y = position.y;
                this.updateHitboxAnchor();
            }
            this._onPointerDown.fire(e);
        });
        this.render.stage.on("pointermove", (e) => {
            if (!this._isHeld)
                return;
            const position = this.render.container.toLocal(e.global);
            const x = position.x, y = position.y;
            // Update position
            this.obj.x = x;
            this.obj.y = y;
            this.updateHitboxAnchor();
            this._onPointerMove.fire(e);
            // Calculate velocity
            if (!this._mousePoint)
                this._mousePoint = { x, y };
            if (!this._mouseMovingTime)
                this._mouseMovingTime = Date.now();
            this._mouseVelocity = vector_1.Vector.multiplyScalar(new vector_1.Vector(this._mousePoint.x - x, y - this._mousePoint.y), 10 / (this._mouseMovingTime - Date.now()));
            // Record mouse data
            this._mousePoint = { x, y };
            this._mouseMovingTime = Date.now();
        });
        this.render.stage.on("pointerup", (e) => {
            var _a;
            if (!this._isHeld)
                return;
            this._isHeld = false;
            this._onPointerUp.fire(Object.assign(Object.assign({}, e), { velocity: (_a = this._mouseVelocity) !== null && _a !== void 0 ? _a : vector_1.Vector.Zero }));
            this._mousePoint = null;
            this._mouseMovingTime = null;
            this._mouseVelocity = null;
        });
    }
    _enableSettings(id, getItems) {
        this.obj.addEventListener("rightclick", () => {
            // To avoid dragging the object
            // NOTE: This is a temporary solution
            this._isHeld = false;
            this._mousePoint = null;
            this._mouseMovingTime = null;
            this._mouseVelocity = null;
            modalProvider_1.modalProvider.open("object-settings", { id, obj: this, items: getItems() });
            const modal = modalProvider_1.modalProvider.getCurrentModal();
            this._register(modal.onSave(({ obj, items }) => {
                if (obj === this)
                    this._onSettingsSave.fire(items);
            }));
        });
    }
    setName(name) {
        this._name = name;
    }
    /**
     * @param x Relative x position
     * @param y Relative y position
     */
    _drawName(x, y) {
        if (!this._name)
            return;
        this.obj.removeChildren();
        const nameText = this.render.createText(this._name, x, y, colors_1.colors["white"], 20, true);
        nameText.x -= nameText.width / 2;
        nameText.y -= nameText.height / 2;
        this.obj.addChild(nameText);
    }
    setMass(mass) {
        this.mass = mass;
        // Update the gravity force
        this._forces.set("gravity", force_1.Force.gravity(this.mass));
    }
    applyForce(key, force) {
        this._forces.add(key, force);
    }
    applyGravity() {
        this._forces.add("gravity", force_1.Force.gravity(this.mass));
    }
    removeForce(key) {
        this._forces.remove(key);
    }
    clearForces() {
        this._forces.clear();
    }
    reverseVelocity(direction, damping = 1) {
        const n = new vector_1.Vector(0, 1);
        const vy = this.velocity.getComponent(n);
        const vx = vector_1.Vector.sub(this.velocity, vy);
        direction === "y"
            ? this.velocity = vector_1.Vector.add(vx, vector_1.Vector.multiplyScalar(vector_1.Vector.reverse(vy), damping))
            : this.velocity = vector_1.Vector.add(vy, vector_1.Vector.multiplyScalar(vector_1.Vector.reverse(vx), damping));
    }
    updateHitboxAnchor() {
        const bound = this.obj.getBounds();
        this.hitbox.setAnchor({
            x: bound.x,
            y: bound.y
        });
    }
    update(delta) {
        if (!this._isHeld) {
            const sumForce = this._forces.getSum();
            const accelerate = sumForce.getAccelerate(this.mass);
            this.velocity = vector_1.Vector.add(this.velocity, accelerate);
            this.obj.x += this.velocity.x * delta;
            this.obj.y -= this.velocity.y * delta;
            this.updateHitboxAnchor();
        }
        this.render.container.addChild(this.obj);
    }
    get onPointerDown() {
        if (!this._isInteractive)
            throw new Error("This object is not interactive, so you cannot add listener(s) to interactive events.");
        return this._onPointerDown.event;
    }
    get onPointerMove() {
        if (!this._isInteractive)
            throw new Error("This object is not interactive, so you cannot add listener(s) to interactive events.");
        return this._onPointerMove.event;
    }
    get onPointerUp() {
        if (!this._isInteractive)
            throw new Error("This object is not interactive, so you cannot add listener(s) to interactive events.");
        return this._onPointerUp.event;
    }
    get onSettingsSave() {
        return this._onSettingsSave.event;
    }
    dispose() {
        this.clearForces();
        this.velocity = vector_1.Vector.Zero;
        this.obj.destroy();
        super.dispose();
    }
}
exports.CanvasObject = CanvasObject;
const objMap = new Map();
function registerObject(id, obj) {
    objMap.set(id, obj);
}
function createObject(id, ...args) {
    const objClass = objMap.get(id);
    if (!objClass) {
        throw new Error("Specified object doesn't exist.");
    }
    return new objClass(...args);
}
