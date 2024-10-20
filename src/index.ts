import "@/style/main.less";

import { version } from "./common/global";
import { Motive } from "./simulator";

console.log(
    "\n%cMotive%cv"+ version +" | Nocpiun Org\n"+
    "%cA web-based physics simulator.\n\n"+
    "%cWebpage: https://motive.nin.red\n"+
    "%cGithub Repo: https://github.com/nocpiun/motive\n\n"+
    "%cDonate: https://nin.red/#/donate\n",
    "font-family: Consolas;font-size: 17pt;font-weight: bold;padding: 10px",
    "font-family: Consolas;font-size: 8pt;color: gray",
    "font-family: Consolas;font-size: 8pt;color: white",
    "font-family: Consolas;font-size: 8pt;color: white",
    "font-family: Consolas;font-size: 8pt;color: white",
    "font-family: Consolas;font-size: 8pt;color: white"
);

const root = document.getElementById("root");

new Motive(root);
