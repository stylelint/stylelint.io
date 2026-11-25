import * as fs from 'node:fs';
import * as path from 'node:path';
import { getPageSlug, stylelintDir } from './slug.mjs';
import assert from 'node:assert/strict';
import { remark } from 'remark';
import { toString } from 'mdast-util-to-string';

/** @import { ListItem, Nodes } from 'mdast' */

/** @typedef {{ label: string, items: string[] }} Group */
/** @typedef {string | Group} Guide */

/**
 * Follows the guides of the Stylelint README, so that a release needs no change here.
 *
 * @returns {Array<Guide | { label: string, slug: string }>}
 */
export function getSidebar() {
	const guides = getGuides();
	const unlistedSlugs = getUnlistedSlugs(guides);

	// A page the README doesn't list goes last in the group of its directory, or last at the top level.
	const groups = guides.map((guide) => {
		if (typeof guide === 'string') return guide;

		const slugs = unlistedSlugs.filter((slug) => isGroupOfPage(guide, slug));

		return {
			...guide,
			items: [...guide.items, ...slugs],
			collapsed: guide.label !== 'User guide',
		};
	});
	const ungroupedSlugs = unlistedSlugs.filter(
		(slug) => !guides.some((guide) => isGroupOfPage(guide, slug)),
	);

	return [
		{ label: 'Home', slug: 'index' },
		...groups,
		...ungroupedSlugs,
		{ label: 'Awesome', slug: 'awesome-stylelint' },
	];
}

/**
 * @returns {Guide[]}
 */
function getGuides() {
	const { children } = remark().parse(fs.readFileSync(`${stylelintDir}/README.md`, 'utf8'));
	const list = children[children.findIndex(isGuidesHeading) + 1];

	assert(list?.type === 'list', 'The Stylelint README has no list after its Guides heading');

	return list.children.map((listItem) => {
		const [paragraph, nestedList] = listItem.children;

		if (nestedList?.type !== 'list') return getLinkSlug(listItem);

		return { label: toString(paragraph), items: nestedList.children.map(getLinkSlug) };
	});
}

/**
 * @param {Nodes} node
 * @returns {boolean}
 */
function isGuidesHeading(node) {
	return node.type === 'heading' && toString(node) === 'Guides';
}

/**
 * @param {ListItem} listItem
 * @returns {string}
 */
function getLinkSlug(listItem) {
	const [paragraph] = listItem.children;

	assert(paragraph?.type === 'paragraph', `The guide "${toString(listItem)}" isn't a paragraph`);

	const [link] = paragraph.children;

	assert(link?.type === 'link', `The guide "${toString(listItem)}" doesn't start with a link`);

	return getPageSlug(link.url);
}

/**
 * @param {Guide[]} guides
 * @returns {string[]}
 */
function getUnlistedSlugs(guides) {
	const listedSlugs = new Set(
		guides.flatMap((guide) => (typeof guide === 'string' ? guide : guide.items)),
	);

	return fs
		.globSync('docs/**/*.md', { cwd: stylelintDir })
		.map(getPageSlug)
		.filter((slug) => !listedSlugs.has(slug))
		.sort();
}

/**
 * @param {Guide} guide
 * @param {string} slug
 * @returns {boolean}
 */
function isGroupOfPage(guide, slug) {
	const directory = path.dirname(slug);

	// Pages at the root, such as `contributing` and `support`, belong to different groups.
	if (typeof guide === 'string' || directory === '.') return false;

	return guide.items.some((item) => path.dirname(item) === directory);
}
