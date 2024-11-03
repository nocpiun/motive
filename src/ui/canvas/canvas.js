"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canvas = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const PIXI = __importStar(require("pixi.js"));
const lucide_1 = require("lucide");
const event_1 = require("@/common/event");
const ui_1 = require("@/ui/ui");
const contextMenuProvider_1 = require("@/ui/contextMenu/contextMenuProvider");
const KaTeX_Main_Regular_ttf_1 = __importDefault(require("@/assets/fonts/KaTeX_Main-Regular.ttf"));
const KaTeX_Main_Regular_woff_1 = __importDefault(require("@/assets/fonts/KaTeX_Main-Regular.woff"));
const KaTeX_Main_Regular_woff2_1 = __importDefault(require("@/assets/fonts/KaTeX_Main-Regular.woff2"));
const KaTeX_Main_Italic_ttf_1 = __importDefault(require("@/assets/fonts/KaTeX_Main-Italic.ttf"));
const KaTeX_Main_Italic_woff_1 = __importDefault(require("@/assets/fonts/KaTeX_Main-Italic.woff"));
const KaTeX_Main_Italic_woff2_1 = __importDefault(require("@/assets/fonts/KaTeX_Main-Italic.woff2"));
require("./canvas.less");
const defaultOptions = {};
class Canvas extends ui_1.Component {
    constructor(target, _options) {
        super((0, jsx_runtime_1.jsx)("div", { className: "motive-canvas-container" }), target, defaultOptions, _options);
        // events
        this._onLoad = new event_1.Emitter();
        this._onClick = new event_1.Emitter();
        this._onRefresh = new event_1.Emitter();
        this._app = new PIXI.Application();
        this.ratio = window.devicePixelRatio || 1;
        this._pixiOptions = {
            backgroundColor: 0xffffff,
            antialias: true,
            resolution: this.ratio,
            resizeTo: this._element,
        };
        if (process.env.NODE_ENV !== "test") {
            try {
                this._init();
            }
            catch (e) {
                throw new Error("Unable to load PIXI.js and canvas.");
            }
        }
        // Context Menu
        contextMenuProvider_1.contextMenuProvider.registerContextMenu(this, [
            {
                text: "刷新画面",
                icon: lucide_1.RotateCw,
                action: () => this._onRefresh.fire()
            },
            { separator: true },
            {
                text: "添加向量",
                icon: lucide_1.MoveUpRight,
                subItems: [
                    {
                        text: "速度",
                        icon: lucide_1.MoveUpRight,
                    },
                    {
                        text: "力",
                        icon: lucide_1.ArrowRightFromLine,
                    }
                ]
            }
        ]);
        this._register(this._onLoad);
    }
    _init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Init PIXI
            yield this._app.init(this._pixiOptions);
            // Init canvas element
            this._element.appendChild(this._app.canvas);
            this._app.canvas.classList.add("motive-canvas");
            this._app.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
            window.addEventListener("resize", () => {
                this._adaptDPR();
            });
            this._adaptDPR();
            // Load assets
            PIXI.Assets.addBundle("fonts", {
                katexRegular: {
                    src: [KaTeX_Main_Regular_ttf_1.default, KaTeX_Main_Regular_woff_1.default, KaTeX_Main_Regular_woff2_1.default],
                    data: { family: "KaTeX-Regular" }
                },
                katexItalic: {
                    src: [KaTeX_Main_Italic_ttf_1.default, KaTeX_Main_Italic_woff_1.default, KaTeX_Main_Italic_woff2_1.default],
                    data: { family: "KaTeX-Italic" }
                }
            });
            yield PIXI.Assets.loadBundle("fonts");
            // Set up interactions
            this._app.stage.interactive = true;
            this._app.stage.on("click", (e) => {
                this._onClick.fire(e);
            });
            // Ready
            this._onLoad.fire(this._app);
        });
    }
    /** To solve the blurring issue of canvas */
    _adaptDPR() {
        const canvas = this._element.querySelector("canvas");
        const { width, height } = canvas;
        canvas.width = Math.round(width * this.ratio);
        canvas.height = Math.round(height * this.ratio);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
    }
    get width() {
        return this._app.canvas.width;
    }
    get height() {
        return this._app.canvas.height;
    }
    get onLoad() {
        return this._onLoad.event;
    }
    get onClick() {
        return this._onClick.event;
    }
    get onRefresh() {
        return this._onRefresh.event;
    }
}
exports.Canvas = Canvas;
