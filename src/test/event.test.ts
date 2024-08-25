import { Emitter, Event } from "@/common/event";

describe("event-interfaces-tests", () => {
    class TestClass {
        private _onEventFired: Emitter<any> = new Emitter();
    
        public get onEventFired(): Event<any> {
            return this._onEventFired.event;
        }

        public get onceEventFired(): Event<any> {
            return this._onEventFired.onceEvent;
        }
    
        public fireEvent(data?: any): void {
            this._onEventFired.fire(data);
        }

        public disposeEmitter(): void {
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
