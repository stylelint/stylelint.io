/* global module */
module.exports = {
	title: 'Stylelint',
	tagline: 'A mighty, modern style linter',
	url: 'https://stylelint.io',
	baseUrl: '/',
	organizationName: 'stylelint',
	projectName: 'stylelint',
	favicon: 'img/favicon.ico',
	onBrokenLinks: 'log',
	onBrokenMarkdownLinks: 'log',
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				blog: false,
				debug: undefined,
				docs: {
					routeBasePath: '/',
					path: 'docs',
					sidebarPath: './sidebars.json',
				},
				theme: {
					customCss: '../src/css/custom.css',
				},
			},
		],
	],
	themeConfig: {
		navbar: {
			logo: {
				alt: 'Stylelint',
				src: 'img/light.svg',
				srcDark: 'img/dark.svg',
			},
			items: [
				{
					to: '/',
					label: 'Docs',
					position: 'left',
				},
				{
					to: '/demo',
					label: 'Demo',
					position: 'left',
				},
				{
					href: 'https://github.com/stylelint/stylelint',
					label: 'GitHub',
					position: 'right',
				},
				{
					href: 'https://twitter.com/stylelint',
					label: 'Twitter',
					position: 'right',
				},
			],
		},
		algolia: {
			apiKey: '29d680ce97507c5cd2836c6c74783c05',
			indexName: 'stylelint',
		},
	},
};
