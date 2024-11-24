import "@/style/main.less";

import { getVersionString } from "./common/global";
import { Motive } from "./simulator";
import { MOTC } from "./motc";

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

const sample = 
`#name Sample Map
#description This is a sample description!
#author NriotHrreion

@objects {
    ball {
        id: ball1
        name: m
        mass: 5
    }

    block {
        id: block1
        name: M
        mass: 10
    }
}

@when {
    3s {
        delete ball1
        delete block1
    }
}`;

console.log(MOTC.parse(sample));
