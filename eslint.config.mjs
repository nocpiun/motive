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
            "no-unused-vars": ["error", {
                "args": "none",
                "caughtErrors": "none"
            }],
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/only-throw-error": "error",
            "@typescript-eslint/switch-exhaustiveness-check": "error",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-unused-vars": ["error", {
                "args": "none",
                "caughtErrors": "none"
            }],
            "@typescript-eslint/consistent-type-imports": "warn",
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
        }
    },
    {
        files: [
            "src/**/*.test.{js,jsx,ts,tsx}"
        ],
        ...jest.configs["flat/recommended"],
        rules: {
            ...jest.configs['flat/recommended'].rules,
            "jest/expect-expect": "off",
            "jest/no-commented-out-tests": "off",
        }
    },
    {
        files: [
            "*.config.{js,mjs}"
        ],
        languageOptions: {
            globals: {
                __dirname: "readonly",
                ...globals.commonjs,
            }
        },
        rules: {
            "@typescript-eslint/no-require-imports": "off"
        }
    },
);
