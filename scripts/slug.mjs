import assert from 'node:assert/strict';

export const stylelintDir = 'node_modules/stylelint';

const slugPatterns = /** @type {const} */ ([
	[/^README\.md$/, 'index'],
	[/^([^/]+)\.md$/, '$1'],
	[/^docs\/(.+)\.md$/, '$1'],
	[/^lib\/rules\/([^/]+)\/README\.md$/, 'user-guide/rules/$1'],
]);

/**
 * @param {string} file Path of a file in the Stylelint repository.
 * @returns {string | undefined} Undefined when the file isn't a page of the site.
 */
export function getSlug(file) {
	const slugPattern = slugPatterns.find(([pattern]) => pattern.test(file));

	if (!slugPattern) return undefined;

	const [pattern, replacement] = slugPattern;

	// Netlify redirects a page URL that isn't lowercase.
	return file.replace(pattern, replacement).toLowerCase();
}

/**
 * @param {string} file Path of a file in the Stylelint repository that must be a page.
 * @returns {string}
 */
export function getPageSlug(file) {
	const slug = getSlug(file);

	assert(slug, `${file} isn't a page of the site`);

	return slug;
}

/**
 * @param {string} slug
 * @returns {string} Root-relative, such as `/user-guide/rules/`.
 */
export function getUrl(slug) {
	// Netlify redirects a page URL that doesn't end in a slash.
	return slug === 'index' ? '/' : `/${slug}/`;
}
