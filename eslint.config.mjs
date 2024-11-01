import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import stylelintConfig from 'eslint-config-stylelint';

export default [
	{
		ignores: ['.docusaurus/*', 'docs/*', 'build/*'],
	},
	...stylelintConfig,
	reactPlugin.configs.flat.recommended,
	reactPlugin.configs.flat['jsx-runtime'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
		settings: {
			react: {
				version: 'detect',
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
