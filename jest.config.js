module.exports = {
    moduleNameMapper: {
        "react/jsx-runtime": "jsx-dom/jsx-runtime.js",
        "\\.(less|css)$": "<rootDir>/__mocks__/styleMock.js",
        "\\.(jpg|png|gif|eot|otf|svg|ttf|woff|woff2|wav|mp3|ogg)$": "<rootDir>/__mocks__/fileMock.js",
    },
    testEnvironment: "jsdom"
};
