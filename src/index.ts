import { Box, Menu, Settings } from "lucide";

import "@/style/main.less";

import { ButtonGroup } from "./ui/button/buttonGroup";

const root = document.getElementById("root");
const group = new ButtonGroup(root);

group.addButton({ text: "Settings", icon: Settings });
group.addButton({ icon: Menu, disabled: true });
group.addButton({ icon: Box });
