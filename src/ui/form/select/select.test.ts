import { Select, type Selection } from "./select";

describe("select-component-tests", () => {
    const selections: Selection[] = [
        {
            value: "s1",
            text: "Selection 1"
        },
        {
            value: "s2",
            text: "Selection 2"
        },
        {
            value: "s3",
            text: "Selection 3"
        },
        {
            value: "s4",
            text: "Selection 4"
        },
    ];

    const select = new Select(document.body, { selections });
    const selectWithPlaceholder = new Select(document.body, { selections, placeholder: "Test2" });
    const selectWithDefaultValue = new Select(document.body, { selections, defaultValue: "s3" });
    const selectWithPlaceholderAndDefaultValue = new Select(document.body, { selections, placeholder: "Test4", defaultValue: "s4" });
    const disabledSelect = new Select(document.body, { selections, disabled: true });
    
    it("select-properties", () => {
        expect(Array.from(select.element.classList)).toStrictEqual(["select"]);
        expect(select.disabled).toBeFalsy();
        expect(select.value).toBe("s1");
        expect(select.element.querySelector(".select-button-label").textContent).toBe("Selection 1");

        expect(selectWithPlaceholder.value).toBeNull();
        expect(selectWithPlaceholder.element.querySelector(".select-button-label").textContent).toBe("Test2");

        expect(selectWithDefaultValue.value).toBe("s3");
        expect(selectWithDefaultValue.element.querySelector(".select-button-label").textContent).toBe("Selection 3");

        expect(selectWithPlaceholderAndDefaultValue.value).toBe("s4");
        expect(selectWithPlaceholderAndDefaultValue.element.querySelector(".select-button-label").textContent).toBe("Selection 4");

        expect(disabledSelect.element.classList.contains("select-disabled")).toBeTruthy();
        expect(disabledSelect.disabled).toBeTruthy();
    });

    it("select-open", () => {
        const button: HTMLButtonElement = select.element.querySelector(".select-button");

        button.click();

        expect(select.element.classList.contains("opened")).toBeTruthy();
    });

    it("select-set-value", () => {
        select.select("s2");

        expect(select.value).toBe("s2");
        expect(select.element.querySelector(".select-button-label").textContent).toBe("Selection 2");
    });

    it("select-close", () => {
        select.closeList();

        expect(select.element.classList.contains("opened")).toBeFalsy();
    });

    it("select-set-null", () => {
        select.select(null);
        expect(select.value).toBe("s1");
        
        selectWithPlaceholder.select(null);
        expect(selectWithPlaceholder.value).toBeNull();
        expect(selectWithPlaceholder.element.querySelector(".select-button-label").textContent).toBe("Test2");

        selectWithDefaultValue.select(null);
        expect(selectWithDefaultValue.value).toBe("s3");

        selectWithPlaceholderAndDefaultValue.select(null);
        expect(selectWithPlaceholderAndDefaultValue.value).toBeNull();
        expect(selectWithPlaceholderAndDefaultValue.element.querySelector(".select-button-label").textContent).toBe("Test4");
    });

    it("select-dispose", () => {
        select.dispose();
        selectWithPlaceholder.dispose();
        selectWithDefaultValue.dispose();
        selectWithPlaceholderAndDefaultValue.dispose();
        disabledSelect.dispose();

        expect(select.element).toBeNull();
        expect(selectWithPlaceholder.element).toBeNull();
        expect(selectWithDefaultValue.element).toBeNull();
        expect(selectWithPlaceholderAndDefaultValue.element).toBeNull();
        expect(disabledSelect.element).toBeNull();
    });
});
