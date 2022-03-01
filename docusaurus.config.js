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
					breadcrumbs: false,
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
			appId: '0T0U7YW7T7',
			apiKey: '2164fcb348ebad562ba0340da4760f25',
			indexName: 'stylelint',
		},
	},
};
