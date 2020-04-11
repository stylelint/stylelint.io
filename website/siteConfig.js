'use strict';

const siteConfig = {
	title: 'stylelint',
	tagline: 'A mighty, modern style linter',

	url: 'https://stylelint.io',
	baseUrl: '/',

	projectName: 'stylelint',
	organizationName: 'stylelint',

	headerLinks: [
		{ doc: 'index', label: 'Docs' },
		{ page: 'demo', label: 'Demo' },
		{ search: true },
		{
			href: 'https://github.com/stylelint/stylelint',
			label: 'GitHub',
		},
		{
			href: 'https://twitter.com/stylelint',
			label: 'Twitter',
		},
	],

	headerIcon: 'img/logo.svg',
	favicon: 'img/favicon.ico',

	colors: {
		primaryColor: '#263238',
		secondaryColor: '#546e7a',
	},

	highlight: {
		theme: 'atelier-forest-light',
	},

	docsUrl: '',

	disableHeaderTitle: true,

	docsSideNavCollapsible: true,

	cleanUrl: true,

	onPageNav: 'separate',

	scripts: ['/js/pattern-validity.js'],

	algolia: {
		apiKey: '29d680ce97507c5cd2836c6c74783c05',
		indexName: 'stylelint',
	},
};

module.exports = siteConfig;
