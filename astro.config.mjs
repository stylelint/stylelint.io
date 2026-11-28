import { defineConfig, passthroughImageService } from 'astro/config';
import { getSidebar } from './scripts/sidebar.mjs';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://stylelint.io',
	trailingSlash: 'always',
	integrations: [
		starlight({
			title: 'Stylelint',
			description: 'A mighty CSS linter that helps you avoid errors and enforce conventions',
			favicon: '/img/favicon.svg',
			logo: {
				light: './src/assets/light.svg',
				dark: './src/assets/dark.svg',
				replacesTitle: true,
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/stylelint/stylelint',
				},
			],
			sidebar: getSidebar(),
			customCss: ['./src/css/custom.css'],
			components: {
				PageTitle: './src/components/PageTitle.astro',
				SiteTitle: './src/components/SiteTitle.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
			expressiveCode: {
				shiki: {
					langAlias: { 'sh-session': 'shellsession' },
				},
			},
		}),
	],
	image: {
		service: passthroughImageService(),
	},
});
