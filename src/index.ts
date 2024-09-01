import "@/style/main.less";

import { Canvas } from "@/ui/canvas/canvas";
import { Render } from "@/render/render";
import { Panel } from "@/ui/panel/panel";

const root = document.getElementById("root");

const canvas = new Canvas(root);
const render = new Render(canvas);

const panel = new Panel(root);
panel.linkRenderer(render);
