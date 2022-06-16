module.exports = {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "env": {
        "browser": true,
        "es2021": true,
        "jest/globals": true
    },
    "settings": {
        "react": {
            "version": "detect"
        }
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jest/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "react",
        "react-hooks",
        "jest"
    ],
    "rules": {
        "react/prop-types": 0,
        "react/react-in-jsx-scope": 0
    }
}
