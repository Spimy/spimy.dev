import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: ['coverage', '**/public', '**/dist', 'yarn.lock']
	},
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	eslintPluginPrettierRecommended,
	{ rules: { '@stylistic/linebreak-style': ['error', 'unix'] } }
];
