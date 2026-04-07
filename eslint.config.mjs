import eslintReact from '@eslint-react/eslint-plugin';
import globals from 'globals';
import stylelintConfig from 'eslint-config-stylelint';

export default [
	{
		ignores: ['.docusaurus/*', 'docs/*', 'build/*'],
	},
	...stylelintConfig,
	eslintReact.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		rules: {
			'require-await': 'error',
			'n/no-unpublished-import': [
				'error',
				{
					allowModules: ['glob', 'remark', 'unist-util-visit'],
				},
			],
		},
	},
];
