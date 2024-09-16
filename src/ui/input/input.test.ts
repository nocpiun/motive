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

    it("input-input", () => {
        let text = "";

        input.onDidChange((value) => {
            text = value;
        });

        input.type("a");
        expect(text).toBe("a");
    });

    it("input-reset", () => {
        input.reset();
        expect(input.value).toBe("");
    });

    it("input-max-length", () => {
        input.type("abcdefghijklmnopqrst");
        expect(input.value.length).toBe(20);

        input.type("u"); // length > 20
        expect(input.value.length).toBe(20);
    });

    it("disabled-input-input", () => {
        disabledInput.type("a");
        expect(disabledInput.value).toBe("");
    });

    it("number-input-input", () => {
        numberInput.type("50");
        expect(numberInput.value).toBe("50");

        numberInput.type("abc");
        expect(numberInput.value).toBe("50");
    });

    it("number-input-max-value", () => {
        numberInput.type("50"); // value = 5050 ("50" + "50"), 5050 > 100
        expect(numberInput.value).toBe("50");
    });

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
