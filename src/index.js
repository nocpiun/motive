"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@/style/main.less");
const global_1 = require("./common/global");
const simulator_1 = require("./simulator");
console.log(`\n%cMotive%c${(0, global_1.getVersionString)()} | Nocpiun Org\n` +
    "%cA web-based physics simulator.\n\n" +
    "%cWebpage: https://motive.nocp.space\n" +
    "%cGithub Repo: https://github.com/nocpiun/motive\n\n" +
    "%cDonate: https://nocp.space/donate\n", "font-family: Consolas;font-size: 17pt;font-weight: bold;padding: 10px", "font-family: Consolas;font-size: 8pt;color: gray", "font-family: Consolas;font-size: 8pt;color: white", "font-family: Consolas;font-size: 8pt;color: white", "font-family: Consolas;font-size: 8pt;color: white", "font-family: Consolas;font-size: 8pt;color: white");
const root = document.getElementById("root");
new simulator_1.Motive(root);
