import { themes as prismThemes } from 'prism-react-renderer'; // eslint-disable-line n/no-extraneous-import
import remarkGithubAdmonitionsToDirectives from 'remark-github-admonitions-to-directives';

/** @type {import('@docusaurus/types').Config} */
const config = {
	future: {
		experimental_faster: true,
	},
	title: 'Stylelint',
	tagline: 'A mighty CSS linter that helps you avoid errors and enforce conventions',
	url: 'https://stylelint.io',
	baseUrl: '/',
	organizationName: 'stylelint',
	projectName: 'stylelint',
	favicon: 'img/favicon.svg',
	onBrokenLinks: 'log',
	onBrokenMarkdownLinks: 'log',
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				blog: false,
				debug: false,
				docs: {
					breadcrumbs: false,
					routeBasePath: '/',
					path: 'docs',
					sidebarPath: './sidebars.json',
					beforeDefaultRemarkPlugins: [remarkGithubAdmonitionsToDirectives],
				},
				theme: {
					customCss: ['./src/css/custom.css'],
				},
			},
		],
	],
	themeConfig: {
		colorMode: {
			respectPrefersColorScheme: true,
		},
		navbar: {
			logo: {
				alt: 'Stylelint',
				src: 'img/light.svg',
				srcDark: 'img/dark.svg',
			},
			items: [
				{
					to: '/',
					label: 'Home',
					position: 'left',
					activeBaseRegex: '^/$',
				},
				{
					to: '/user-guide/rules',
					label: 'Rules',
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
			],
			hideOnScroll: true,
		},
		algolia: {
			appId: '0T0U7YW7T7',
			apiKey: '2164fcb348ebad562ba0340da4760f25',
			indexName: 'stylelint',
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.palenight,
			// See https://prismjs.com/#supported-languages
			additionalLanguages: ['bash', 'css', 'diff', 'json', 'markdown', 'shell-session'],
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
						headers: (req) => {
							if (req.baseUrl !== '/demo') {
								return [];
							}

							return [
								{ key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
								{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
							];
						},
					};

					return {
						devServer,
					};
				},
			};
		},
	],
	clientModules: ['./src/stylelint-io-global-script.js'],
};

export default config;
