module.exports = {
	"root": true,
	"env": {
		"node": true,
		"browser": true,
		"es2021": true
	},
	"extends": [
		"@nuxtjs/eslint-config-typescript",
		'plugin:prettier-vue/recommended',
		'prettier', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
	],
	"rules": {
		"no-shadow": ["error", { "allow": ["state"] }],
		"vue/attribute-hyphenation": 0,
		"vue/no-v-html": 0,
		"vue/html-self-closing": 0,
		"vue/this-in-template": 0,
		"no-tabs": 0,
		"indent": ["error", "tab", { "SwitchCase": 1 }],
		"linebreak-style": ["error", "unix"],
		"quotes": ["error", "backtick"],
		"no-var": "error",
		"array-callback-return": "error",
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
		"strict": ["error", "global"],
		"init-declarations": "error",
		"array-bracket-newline": "error",
		"array-bracket-spacing": "error",
		"block-spacing": "error",
		"camelcase": "error",
		"brace-style": ["error", "1tbs"],
		"comma-dangle": [2, "always-multiline"],
		"consistent-this": "error",
		"func-style": [
			"error", "declaration", {
				"allowArrowFunctions": true
			}
		],
		"arrow-spacing": [
			"error", {
				"before": true,
				"after": true
			}
		],
		"no-case-declarations": "off",
		"import/no-named-as-default": "off"
	},
	"globals": {
	},
	"ignorePatterns": [
		"/.eslintrc.js",
		"3rd/js/*"
	]
}