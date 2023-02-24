/* global module, require */

/** @type {typeof import('@generated/docusaurus.config').default} */
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
					rehypePlugins: [require('./rehype-plugin-crossorigin-attr.js')],
				},
				theme: {
					customCss: [require.resolve('./src/css/custom.css')],
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
	plugins: [
		// Sets response headers for development.
		function coiPlugin() {
			return {
				name: 'docusaurus-plugin-coi',
				configureWebpack(_config, isServer) {
					if (isServer) {
						return {};
					}

					/** @type {import('webpack-dev-server').Configuration} */
					const devServer = {
						headers: [
							{ key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
							{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
						],
					};

					return {
						devServer,
					};
				},
			};
		},
	],
};
