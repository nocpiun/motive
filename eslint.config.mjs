import js from "@eslint/js";
import ts from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import jest from "eslint-plugin-jest";
import globals from "globals";

export default ts.config(
    // presets
    js.configs.recommended,
    ...ts.configs.recommended,
    importPlugin.flatConfigs.recommended,

    // configurations
    {
        files: [
            "src/**/*.{js,jsx,ts,tsx}"
        ],
        ignores: [
            "eslint.config.js"
        ],
        languageOptions: {
            parserOptions: {
                sourceType: "module",
                project: true,
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                ...globals.browser,
                ...globals.worker,
                ...globals.jest,
            }
        },
        settings: {
            "import/resolver": {
                typescript: {
                    project: "./tsconfig.json"
                }
            }
        },
        rules: {
            "eqeqeq": "error",
            "prefer-arrow-callback": "warn",
            "prefer-const": "error",
            "import/order": ["warn", {
                "groups": [
                    "type",
                    "builtin",
                    "external",
                    "internal",
                    "sibling",
                ],
                "newlines-between": "always"
            }],
            "import/first": "error",
            "import/no-duplicates": "error",
            "import/no-named-as-default": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/only-throw-error": "error",
        }
    },
    {
        files: [
            "src/**/*.test.{js,jsx,ts,tsx}"
        ],
        ...jest.configs["flat/recommended"],
        rules: {
            ...jest.configs['flat/recommended'].rules,
        }
    },
);
