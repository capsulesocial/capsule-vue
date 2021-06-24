module.exports = {
  "root": true,
  "env": {
    "node": true,
    "browser": true,
    "es2021": true
  },
  "extends": [
    "@nuxtjs/eslint-config-typescript"
  ],
  "rules": {
    "vue/attribute-hyphenation": 0,
    "vue/no-v-html": 0,
    "vue/html-self-closing": 0,
    "vue/this-in-template": 0,
    "indent": [
      "error"
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error"
    ],
    "semi": [
      "error",
      "never"
    ],
    "no-var": "error",
    "array-callback-return": "error",
    "complexity": "error",
    "consistent-return": "error",
    "curly": "error",
    "default-case": "error",
    "default-case-last": "error",
    "dot-location": "error",
    "eqeqeq": "error",
    "grouped-accessor-pairs": "error",
    "guard-for-in": "error",
    "no-eq-null": "error",
    "no-empty-pattern": "error",
    "no-empty-function": "warn",
    "no-eval": "error",
    "no-fallthrough": "error",
    "no-implicit-coercion": "error",
    "no-implied-eval": "error",
    "no-invalid-this": "error",
    "no-this-before-super": "error",
    "no-iterator": "error",
    "no-labels": "error",
    "no-lone-blocks": "error",
    "no-loop-func": "error",
    "no-new-wrappers": "error",
    "no-return-assign": "error",
    "require-await": "error",
    "strict": [
      "error",
      "global"
    ],
    "init-declarations": "error",
    "no-shadow": "error",
    "array-bracket-newline": "error",
    "array-bracket-spacing": "error",
    "array-element-newline": "error",
    "no-unused-vars": false,
    "block-spacing": "error",
    "camelcase": "error",
    "brace-style": [
      "error",
      "1tbs"
    ],
    "comma-dangle": [
      2,
      "always-multiline"
    ],
    "consistent-this": "off",
    "func-style": [
      "error",
      "declaration",
      {
        "allowArrowFunctions": true
      }
    ],
    "arrow-parens": "error",
    "arrow-spacing": [
      "error",
      {
        "before": true,
        "after": true
      }
    ]
  },
  "globals": {
  },
  "ignorePatterns": [
    "/.eslintrc.js",
    "3rd/js/*"
  ]
}