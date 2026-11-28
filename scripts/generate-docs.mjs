import * as fs from 'node:fs';
import * as path from 'node:path';
import { SKIP, visit } from 'unist-util-visit';
import { getPageSlug, getSlug, getUrl, stylelintDir } from './slug.mjs';
import remarkGithubAdmonitionsToDirectives, {
	DEFAULT_MAPPING,
} from 'remark-github-admonitions-to-directives';
import assert from 'node:assert/strict';
import process from 'node:process';
import { remark } from 'remark';
import remarkDirective from 'remark-directive';
import remarkGFM from 'remark-gfm';
import { toString } from 'mdast-util-to-string';

/** @import { Code, Html, Nodes, Root } from 'mdast' */
/** @import { BuildVisitor } from 'unist-util-visit' */
/** @import { VFile } from 'vfile' */

const rulesSlug = 'user-guide/rules';

// Starlight has no `info` or `warning` aside, which the plugin maps these alerts to.
const asideByAlert = { ...DEFAULT_MAPPING, IMPORTANT: 'note', WARNING: 'caution' };

// The meta of a diff fence starts with the language of its lines, such as `json`.
const languagePattern = /^[\w-]+(?=\s|$)/;

/**
 * @param {string} outputDir
 */
function main(outputDir) {
	fs.rmSync(outputDir, { force: true, recursive: true });
	fs.mkdirSync(outputDir, { recursive: true });

	const ruleSlugs = getRuleSlugs();
	const files = fs.globSync(['*.md', 'docs/**/*.md', 'lib/rules/*/README.md'], {
		cwd: stylelintDir,
	});
	const pageSlugs = new Set(files.map(getPageSlug));

	for (const file of files) {
		const slug = getPageSlug(file);
		const content = processMarkdown(
			path.join(stylelintDir, file),
			{
				// Starlight would otherwise title the homepage "Stylelint | Stylelint".
				head: slug === 'index' ? [{ tag: 'title', content: 'Stylelint' }] : undefined,
				editUrl: `https://github.com/stylelint/stylelint/edit/main/${file}`,
				...getRulePagination(ruleSlugs, slug),
			},
			{
				rewriter: (url) => rewriteUrl(url, file, pageSlugs),
				isRules: slug === rulesSlug,
			},
		);

		writePage(outputDir, slug, content);
	}

	for (const image of fs.globSync('*.png', { cwd: stylelintDir })) {
		fs.copyFileSync(path.join(stylelintDir, image), path.join(outputDir, image));
	}

	const awesome = processMarkdown('node_modules/awesome-stylelint/README.md', {
		editUrl: 'https://github.com/stylelint/awesome-stylelint/edit/main/README.md',
	});

	writePage(outputDir, 'awesome-stylelint', awesome);

	console.log(`Documents have been generated to '${outputDir}'.`); // eslint-disable-line no-console
}

/**
 * @returns {string[]}
 */
function getRuleSlugs() {
	const rules = fs.readFileSync(`${stylelintDir}/docs/${rulesSlug}.md`, 'utf8');
	const files = rules.match(/lib\/rules\/[^/]+\/README\.md/g);

	assert(files, `${rulesSlug}.md links to no rules`);

	return [...new Set(files.map(getPageSlug))];
}

/**
 * @param {string} file
 * @param {Record<string, unknown>} frontMatter
 * @param {{ rewriter?: (url: string) => string, isRules?: boolean }} [options]
 * @returns {string}
 */
function processMarkdown(file, frontMatter, { rewriter = (url) => url, isRules = false } = {}) {
	const processor = remark()
		.use(remarkGFM)
		.use(remarkGithubAdmonitionsToDirectives, { mapping: asideByAlert })
		.use(remarkDirective)
		.use(removeTitle)
		.use(rewriteLink, { rewriter })
		.use(wrapProblemExample)
		.use(rewriteSponsorsSvg)
		.use(makeRuleSymbolsAccessible)
		.use(setDiffLanguage)
		.use(removeHtmlComments);

	if (isRules) processor.use(wrapRules);

	const output = processor.processSync({ path: file, value: fs.readFileSync(file, 'utf8') });

	return insertFrontMatter(String(output), { title: output.data.title, ...frontMatter });
}

// Starlight renders the title of the front matter as the H1.
function removeTitle() {
	/**
	 * @param {Root} tree
	 * @param {VFile} file
	 */
	function transform(tree, file) {
		const titleIndex = tree.children.findIndex(isTitle);

		assert(titleIndex !== -1, `${file.path} has no H1`);

		const [title] = tree.children.splice(titleIndex, 1);

		file.data.title = toString(title, { includeImageAlt: false }).trim();
	}

	return transform;
}

/**
 * @param {Nodes} node
 * @returns {boolean}
 */
function isTitle(node) {
	return node.type === 'heading' && node.depth === 1;
}

/**
 * @param {{ rewriter: (url: string) => string }} options
 */
function rewriteLink(options) {
	/** @type {Array<'definition' | 'link'>} */
	const nodeTypes = ['link', 'definition'];

	/** @type {BuildVisitor<Root, typeof nodeTypes>} */
	function visitor(node) {
		node.url = options.rewriter(node.url);
	}

	/**
	 * @param {Root} tree
	 */
	function transform(tree) {
		visit(tree, nodeTypes, visitor);
	}

	return transform;
}

function wrapProblemExample() {
	/** @type {BuildVisitor<Root, 'paragraph'>} */
	function visitor(node, index, parent) {
		if (!parent || index === undefined) return;

		if (!isTrigger(node)) return;

		const isValid = toString(node.children[1]) === 'not';
		const className = isValid ? 'valid-pattern' : 'invalid-pattern';

		parent.children.splice(index + 1, 0, { type: 'html', value: `<div class="${className}">` });

		const endIndex = parent.children.findIndex(
			(child, childIndex) => childIndex > index && isEndOfExample(child),
		);

		parent.children.splice(endIndex === -1 ? parent.children.length : endIndex, 0, {
			type: 'html',
			value: '</div>',
		});
	}

	/**
	 * @param {Nodes} node
	 * @returns {boolean}
	 */
	function isTrigger(node) {
		if (node.type !== 'paragraph') return false;

		// There can be an `emphasis` node with "not" between the `first` and `last` nodes
		const [first, , last] = node.children;
		const text = toString(first).trimEnd() + toString(last);

		return [
			'The following patterns are considered problems:',
			'The following pattern is considered a problem:',
		].includes(text);
	}

	/**
	 * @param {Nodes} node
	 * @returns {boolean}
	 */
	function isEndOfExample(node) {
		return isTrigger(node) || node.type === 'heading';
	}

	/**
	 * @param {Root} tree
	 */
	function transform(tree) {
		visit(tree, 'paragraph', visitor);
	}

	return transform;
}

function rewriteSponsorsSvg() {
	/** @type {BuildVisitor<Root, 'html'>} */
	function visitor(node) {
		const data = node.value.match(/^<object\b[^>]*\sdata="([^"]+)"/)?.[1];
		const url = data && URL.parse(data);

		if (!url || !isSponsorsSvg(url)) return;

		// Open Collective embeds each logo at twice this height, so a smaller height makes the SVG much smaller.
		url.searchParams.set('avatarHeight', '32');
		// The SVG has a fixed width, so it must fit a narrow viewport.
		url.searchParams.set('width', '320');

		// Browsers download the fallback image too.
		node.value = `<object data="${url}" type="image/svg+xml" aria-label="Sponsors"></object>`;
	}

	/**
	 * @param {Root} tree
	 */
	function transform(tree) {
		visit(tree, 'html', visitor);
	}

	return transform;
}

/**
 * @param {URL} url
 * @returns {boolean}
 */
function isSponsorsSvg(url) {
	return url.hostname === 'opencollective.com' && url.pathname.endsWith('/sponsors.svg');
}

function makeRuleSymbolsAccessible() {
	const symbols = new Map([
		['✅', 'Standard'],
		['🔧', 'Autofixable'],
	]);

	/** @type {BuildVisitor<Root, 'text'>} */
	function visitor(node, _index, parent) {
		if (!parent) return;

		const symbol = node.value;
		const name = symbols.get(symbol);

		if (!name) return;

		parent.children = [
			{
				type: 'html',
				value: `<span title="${name}">${symbol}</span>`,
			},
		];
	}

	/**
	 * @param {Root} tree
	 */
	function transform(tree) {
		visit(tree, 'text', visitor);
	}

	return transform;
}

// Expressive Code reads the language of a diff from a `lang` attribute.
function setDiffLanguage() {
	/** @type {BuildVisitor<Root, 'code'>} */
	function visitor(node) {
		if (!isDiffOfLanguage(node)) return;

		node.meta = node.meta.replace(languagePattern, (language) => `lang="${language}"`);
	}

	/**
	 * @param {Root} tree
	 */
	function transform(tree) {
		visit(tree, 'code', visitor);
	}

	return transform;
}

/**
 * @param {Code} node
 * @returns {node is Code & { meta: string }}
 */
function isDiffOfLanguage(node) {
	return node.lang === 'diff' && languagePattern.test(node.meta ?? '');
}

function removeHtmlComments() {
	/**
	 * @param {Html} node
	 * @returns {boolean}
	 */
	const isHtmlComment = (node) => /^<!--[\s\S]*-->$/.test(node.value.trim());

	/** @type {BuildVisitor<Root, 'html'>} */
	function visitor(node, index, parent) {
		if (!parent || index === undefined) return;

		if (!isHtmlComment(node)) return;

		parent.children.splice(index, 1);

		return [SKIP, index];
	}

	/**
	 * @param {Root} tree
	 */
	function transform(tree) {
		visit(tree, 'html', visitor);
	}

	return transform;
}

// Starlight gives a page no class for the styles of the tables to use.
function wrapRules() {
	/**
	 * @param {Root} tree
	 */
	function transform(tree) {
		tree.children = [
			{ type: 'html', value: '<div class="rules">' },
			...tree.children,
			{ type: 'html', value: '</div>' },
		];
	}

	return transform;
}

/**
 * @param {string} content
 * @param {Record<string, unknown>} props
 * @returns {string}
 */
function insertFrontMatter(content, props) {
	const lines = Object.entries(props)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => `${key}: ${JSON.stringify(value)}`);

	return ['---', ...lines, '---', '', content].join('\n');
}

/**
 * @param {string} url
 * @param {string} file Path, in the Stylelint repository, of the file that holds the link.
 * @param {Set<string>} pageSlugs
 * @returns {string}
 */
function rewriteUrl(url, file, pageSlugs) {
	if (!isRelative(url)) {
		return url.replace(
			/^https:\/\/github\.com\/stylelint\/awesome-stylelint\/?(?:#readme)?(#.+)?$/,
			(_match, hash = '') => `${getUrl('awesome-stylelint')}${hash}`,
		);
	}

	const { pathname, search, hash } = new URL(url, `file:///${file}`);
	const linkedFile = pathname.slice(1);
	const slug = getSlug(linkedFile);

	if (!slug)
		return `https://github.com/stylelint/stylelint/blob/main/${linkedFile}${search}${hash}`;

	if (!pageSlugs.has(slug)) console.warn(`${file} links to ${url}, which isn't a page`);

	return `${getUrl(slug)}${hash}`;
}

/**
 * @param {string} url
 * @returns {boolean}
 */
function isRelative(url) {
	return !url.startsWith('#') && !URL.canParse(url);
}

/**
 * Starlight paginates from the sidebar, which doesn't list the rules.
 *
 * @param {string[]} ruleSlugs
 * @param {string} slug
 */
function getRulePagination(ruleSlugs, slug) {
	const index = ruleSlugs.indexOf(slug);

	if (index === -1) return {};

	const prev = ruleSlugs[index - 1];
	const next = ruleSlugs[index + 1];

	return {
		prev: prev ? getRuleLink(prev) : { link: getUrl(rulesSlug), label: 'Rules' },
		next: next && getRuleLink(next),
	};
}

/**
 * @param {string} slug
 */
function getRuleLink(slug) {
	return { link: getUrl(slug), label: path.basename(slug) };
}

/**
 * @param {string} outputDir
 * @param {string} slug
 * @param {string} content
 */
function writePage(outputDir, slug, content) {
	const outputFile = path.join(outputDir, `${slug}.md`);

	fs.mkdirSync(path.dirname(outputFile), { recursive: true });
	fs.writeFileSync(outputFile, content, 'utf8');
}

const outputDir = process.argv[2];

assert(outputDir, 'Pass the directory to generate the docs in');

main(outputDir);
