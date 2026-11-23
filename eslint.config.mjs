import stylelintConfig from 'eslint-config-stylelint';

export default [
	{
		ignores: ['.astro/*', 'dist/*'],
	},
	...stylelintConfig,
	{
		rules: {
			'require-await': 'error',
		},
	},
];
