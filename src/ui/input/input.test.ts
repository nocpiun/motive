import { Input } from "./input";

describe("input-component-tests", () => {
    const input = new Input(document.body, { placeholder: "Test1", maxLength: 20 });
    const disabledInput = new Input(document.body, { disabled: true });
    const numberInput = new Input(document.body, { type: "number", maxValue: 100 });
    const inputWithDefaultValue = new Input(document.body, { defaultValue: "Test2" });

    it("input-properties", () => {
        expect(Array.from(input.element.classList)).toStrictEqual(["input"]);
        expect(input.element.getAttribute("data-type")).toBe("text");
        expect(input.element.disabled).toBeFalsy();

        expect(disabledInput.element.classList.contains("input-disabled")).toBeTruthy();
        expect(disabledInput.element.disabled).toBeTruthy();

        expect(numberInput.element.getAttribute("data-type")).toBe("number");

        expect(inputWithDefaultValue.value).toBe("Test2");
        expect(inputWithDefaultValue.element.value).toBe("Test2");
    });

    /** @todo */
    // it("input-input", () => {
    //     let text = "";

    //     input.onDidChange((value) => {
    //         text = value;
    //     });

    //     input.value = "a";
    //     expect(text).toBe("a");
    // });

    it("input-dispose", () => {
        input.dispose();
        disabledInput.dispose();
        numberInput.dispose();
        inputWithDefaultValue.dispose();

        expect(input.element).toBeNull();
        expect(disabledInput.element).toBeNull();
        expect(numberInput.element).toBeNull();
        expect(inputWithDefaultValue.element).toBeNull();
    });
});
