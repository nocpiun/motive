import "@/style/main.less";

import { getVersionString } from "./common/global";
import { Motive } from "./simulator";

console.log(
    `\n%cMotive%c${getVersionString()} | Nocpiun Org\n`+
    "%cA web-based physics simulator.\n\n"+
    "%cWebpage: https://motive.nocp.space\n"+
    "%cGithub Repo: https://github.com/nocpiun/motive\n\n"+
    "%cDonate: https://nocp.space/donate\n",
    "font-family: Consolas;font-size: 17pt;font-weight: bold;padding: 10px",
    "font-family: Consolas;font-size: 8pt;color: gray",
    "font-family: Consolas;font-size: 8pt;color: white",
    "font-family: Consolas;font-size: 8pt;color: white",
    "font-family: Consolas;font-size: 8pt;color: white",
    "font-family: Consolas;font-size: 8pt;color: white"
);

const root = document.getElementById("root");

new Motive(root);
