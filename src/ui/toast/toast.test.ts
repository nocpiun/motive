import { toastProvider } from "./toastProvider";
import { Toast } from "./toast";

describe("toast-component-tests", () => {
    const toast = new Toast(document.body, { text: "test toast" });
    const toastWithTitle = new Toast(document.body, { title: "Test Title", text: "test toast with title", variant: "danger" });

    it("toast-properties", () => {
        expect(Array.from(toast.element.classList)).toStrictEqual(["toast", "toast-secondary"]);
        expect(Array.from(toastWithTitle.element.classList)).toStrictEqual(["toast", "toast-danger"]);

        expect(toast.text).toBe("test toast");
        expect(toastWithTitle.text).toBe("test toast with title");
        expect(toastWithTitle.title).toBe("Test Title");
    });

    // it("toast-dispose", () => {
    //     toast.dispose();
    //     toastWithTitle.dispose();

    //     expect(toast.element).toBeNull();
    //     expect(toastWithTitle.element).toBeNull();
    // });
});

describe("toast-provider-tests", () => {
    it("get-toast-provider", () => {
        expect(toastProvider).toBeDefined();
    });

    it("show-toast", () => {
        const toastElement = toastProvider.showToast("test toast").element;

        expect(toastElement).toBeDefined();
        expect(toastElement.querySelector(".toast-text").textContent).toBe("test toast");
    });

    it("show-title-toast", () => {
        const toastElement = toastProvider.showTitleToast("Test Title", "test toast with title", 3000, "danger").element;

        expect(toastElement).toBeDefined();
        expect(toastElement.querySelector(".toast-title").textContent).toBe("Test Title");
        expect(toastElement.querySelector(".toast-text").textContent).toBe("test toast with title");
    });

    it("close-toast", () => {
        // toastProvider.showToast("test toast", 3000, "success");
        toastProvider.closeToast();

        // const toastElement = document.querySelector(".toast-success");
        // expect(toastElement).toBeNull();
    });
});
