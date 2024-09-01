import "@/style/main.less";
import { Panel } from "@/ui/panel/panel";
import { Canvas } from "@/ui/canvas/canvas";
import { Render } from "@/render/render";

const root = document.getElementById("root");

const canvas = new Canvas(root);
const render = new Render(canvas);

const panel = new Panel(root);
panel.linkRenderer(render);
