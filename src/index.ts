import "@/style/main.less";

import { Button } from "./ui/button/button";

function addButton(variant: any): void {
    const button = new Button("Test123", { variant, disabled: false });
    document.body.appendChild(button.element);
}

addButton("primary");
addButton("secondary");
addButton("success");
addButton("danger");
