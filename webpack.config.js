const path = require("path");

const TerserWebpackPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInjector = require("html-webpack-injector");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    entry: {
        main: "./src/index.ts"
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "build"),
        libraryTarget: "umd",
        globalObject: "this"
    },
    module: {
        rules: [
            {
                test: /\.(ttf|otf|woff2?)$/,
                type: "asset/resource",
                dependency: { not: ["url"] },
                generator: {
                    filename: "assets/[name].[hash].[ext]"
                }
            },
            {
                test: /\.(js|mjs|ts)$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                loader: "ts-loader"
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[hash].[ext]",
                    outputPath: "assets"
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "./public/index.html"),
            filename: path.join(__dirname, "./build/index.html"),
            minify: false
        }),
        new HtmlWebpackInjector(),
        new MiniCssExtractPlugin({
            filename: "[name].bundle.css"
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                extractComments: false
            }),
            new CssMinimizerPlugin()
        ],
        splitChunks: {
            chunks: "all",
        }
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "react/jsx-runtime": "jsx-dom/jsx-runtime.js"
        }
    },
    devtool: "source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, "./build"),
        },
        open: true,
        hot: true,
        port: 5000,
    }
};
