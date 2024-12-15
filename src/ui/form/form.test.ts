import type { SettingsList } from "@/common/settings";

import { Form } from "./form";

describe("form-component-tests", () => {
    const list: SettingsList<any> = {
        defaultTest: { // default: input
            name: "Input Test 1",
            value: "Test Value 1",
        },
        inputTest: {
            name: "Input Test 2",
            value: "Test Value 2",
            controlOptions: {
                placeholder: "Test Placeholder"
            }
        },
        // switcherTest: {
        //     name: "Switcher Test",
        //     value: true,
        //     type: "switcher"
        // },
        selectTest: {
            name: "Select Test",
            value: "s2",
            type: "select",
            controlOptions: {
                selections: [
                    {
                        value: "s1",
                        text: "Selection 1"
                    },
                    {
                        value: "s2",
                        text: "Selection 2"
                    },
                ]
            }
        }
    };

    const form = new Form(document.body);
    
    it("form-properties", () => {
        expect(Array.from(form.element.classList)).toStrictEqual(["form"]);
    });

    it("form-register-settings-list", () => {
        form.registerList(Object.assign(list));

        expect(form.element.childNodes.length).toBe(3);
    });

    it("form-controls-properties", () => {
        const defaultTest = document.getElementById("defaultTest").querySelector(".form-item-control").childNodes[0] as HTMLInputElement;
        const inputTest = document.getElementById("inputTest").querySelector(".form-item-control").childNodes[0] as HTMLInputElement;
        // const switcherTest = document.getElementById("switcherTest");
        const selectTest = document.getElementById("selectTest").querySelector(".form-item-control").childNodes[0] as HTMLDivElement;

        expect(defaultTest.tagName).toBe("INPUT");
        
        expect(inputTest.tagName).toBe("INPUT");
        expect(inputTest.value).toBe("Test Value 2");
        expect(inputTest.placeholder).toBe("Test Placeholder");

        expect(selectTest.tagName).toBe("DIV");
        expect(Array.from(selectTest.classList)).toStrictEqual(["select"]);
        expect(selectTest.querySelector(".select-list").childNodes.length).toBe(2);
    });

    it("form-submit", () => {
        let counter = 0;

        form.onSubmit(() => {
            counter++;
        });

        expect(form.submit()).toStrictEqual(Object.assign(list));
        expect(counter).toBe(1);
    });

    it("form-unregister-settings-list", () => {
        form.unregisterList();

        expect(form.element.hasChildNodes()).toBeFalsy();
    });

    it("form-dispose", () => {
        form.dispose();

        expect(form.element).toBeNull();
    });
});
