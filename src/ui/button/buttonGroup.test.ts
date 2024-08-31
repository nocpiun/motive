import { ButtonGroup } from "./buttonGroup";

describe("button-group-component-tests", () => {
    const group = new ButtonGroup(document.body);
    const groupStyled = new ButtonGroup(document.body, { variant: "primary" });
    const groupDisabled = new ButtonGroup(document.body, { disabled: true });

    it("group-add-button", () => {
        const button = group.addButton({ text: "Test1" });

        expect(Array.from(group.element.getElementsByTagName("button")).includes(button.element)).toBeTruthy();
    });

    it("disabled-group-add-button", () => {
        const button = groupDisabled.addButton({ text: "Test2", disabled: false });

        expect(button.disabled).toBeTruthy();
    });

    it("styled-group-add-button", () => {
        const button = groupStyled.addButton({ text: "Test3", variant: "danger" });

        expect(button.variant).toBe("primary");
    });

    it("button-group-change", () => {
        let counter = 0;

        group.onDidChange((_newButton) => {
            counter++;
        });

        group.addButton({ text: "Test4" });
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
