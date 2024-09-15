import { ButtonGroup } from "./buttonGroup";

describe("button-group-component-tests", () => {
    const group = new ButtonGroup(document.body);
    const groupStyled = new ButtonGroup(document.body, { variant: "primary" });
    const groupDisabled = new ButtonGroup(document.body, { disabled: true });

    it("group-add-button", () => {
        const button = group.addButton({ text: "Test1" });

        expect(Array.from(group.element.getElementsByTagName("button")).includes(button.element)).toBeTruthy();
    });

    it("group-add-clickable-button", () => {
        let counter = 0;

        const button = group.addButton({ text: "Test2" }, () => counter++);
        button.element.click();

        expect(counter).toBe(1);
    });

    it("disabled-group-add-button", () => {
        const button = groupDisabled.addButton({ text: "Test3", disabled: false });

        expect(button.disabled).toBeTruthy();
    });

    it("styled-group-add-button", () => {
        const button = groupStyled.addButton({ text: "Test4", variant: "danger" });

        expect(button.variant).toBe("primary");
    });

    it("button-group-change", () => {
        let counter = 0;

        group.onDidChange(() => {
            counter++;
        });

        group.addButton({ text: "Test5" });
        expect(counter).toBe(1);
    });

    it("button-group-dispose", () => {
        group.dispose();
        groupStyled.dispose();
        groupDisabled.dispose();

        expect(group.element).toBeNull();
        expect(groupStyled.element).toBeNull();
        expect(groupDisabled.element).toBeNull();
    });
});
