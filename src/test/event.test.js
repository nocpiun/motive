"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("@/common/event");
describe("event-interfaces-tests", () => {
    class TestClass {
        constructor() {
            this._onEventFired = new event_1.Emitter();
        }
        get onEventFired() {
            return this._onEventFired.event;
        }
        get onceEventFired() {
            return this._onEventFired.onceEvent;
        }
        fireEvent(data) {
            this._onEventFired.fire(data);
        }
        disposeEmitter() {
            this._onEventFired.dispose();
        }
    }
    const test = new TestClass();
    let counter1 = 0, counter2 = 0, counter3 = 0;
    it("register-listener", () => {
        test.onEventFired(() => {
            counter1++;
        });
    });
    it("register-once-listener", () => {
        test.onceEventFired(() => {
            counter2++;
        });
    });
    it("register-data-listener", () => {
        test.onEventFired((num = 0) => {
            counter3 += num;
        });
    });
    it("fire-event", () => {
        test.fireEvent();
        expect(counter1).toBe(1);
        expect(counter2).toBe(1);
        expect(counter3).toBe(0);
        test.fireEvent();
        expect(counter1).toBe(2);
        expect(counter2).toBe(1);
        expect(counter3).toBe(0);
        test.fireEvent(5);
        expect(counter1).toBe(3);
        expect(counter2).toBe(1);
        expect(counter3).toBe(5);
    });
    it("dispose-emitter", () => {
        test.disposeEmitter();
        test.fireEvent();
        expect(counter1).toBe(3);
        expect(counter2).toBe(1);
        expect(counter3).toBe(5);
    });
});
