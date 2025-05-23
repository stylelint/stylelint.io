import * as fs from 'node:fs';
import * as path from 'node:path';
import { glob } from 'glob';
import process from 'node:process';
import { remark } from 'remark';
import remarkGFM from 'remark-gfm';
import { visit } from 'unist-util-visit';

function rewriteLink(options) {
	function visitor(node) {
		node.url = options.rewriter(node.url);
	}

	function transform(tree) {
		visit(tree, ['link'], visitor);
	}

	return transform;
}

function wrapProblemExample() {
	function visitor(node, index, parent) {
		const isValid = node.children[1]?.children[0]?.value === 'not';
		const className = isValid ? 'valid-pattern' : 'invalid-pattern';
		const wrapperStart = { type: 'html', value: `<div class="${className}">` };
		const wrapperEnd = { type: 'html', value: '</div>' };

		// Insert to the next position of the paragraph
		parent.children.splice(index + 1, 0, wrapperStart);

		const childrenLength = parent.children.length;

		// Find the end position
		let endIndex = index + 1;

		while (endIndex < childrenLength) {
			const child = parent.children[endIndex];

			if (isTrigger(child) || child.type === 'heading') {
				break;
			}

			endIndex++;
		}

		// Insert to the end position
		if (endIndex === childrenLength) {
			parent.children.push(wrapperEnd);
		} else {
			parent.children.splice(endIndex, 0, wrapperEnd);
		}
	}

	function isTrigger(node) {
		if (node.type !== 'paragraph') return false;

		if (!node.children) return false;

		// There can be an `emphasis` node with "not" between the `first` and `last` nodes
		const [first, , last] = node.children;
		const text = (first?.value ?? '').trimEnd() + (last?.value ?? '');

		return [
			'The following patterns are considered problems:',
			'The following pattern is considered a problem:',
		].includes(text);
	}

	function transform(tree) {
		visit(tree, isTrigger, visitor);
	}

	return transform;
}

function makeRuleSymbolsAccessbile() {
	const symbols = new Map([
		['✅', 'Standard'],
		['🔧', 'Autofixable'],
	]);

	function visitor(node, _index, parent) {
		const symbol = node.value;
		const name = symbols.get(symbol);

		parent.children = [
			{
				type: 'html',
				value: `<span title="${name}">${symbol}</span>`,
			},
		];
	}

	function transform(tree) {
		const test = [...symbols.keys()].map((value) => ({ type: 'text', value }));

		visit(tree, test, visitor);
	}

	return transform;
}

// NOTE: Prism doesn't support JSONC.
function jsoncToJson() {
	function visitor(node) {
		node.lang = 'json';
	}

	function transform(tree) {
		visit(tree, { type: 'code', lang: 'jsonc' }, visitor);
	}

	return transform;
}

function insertFrontMatter(content, props) {
	const lines = ['---'];

	for (const [key, value] of Object.entries(props)) {
		if (!value) continue;

		lines.push(`${key}: ${value}`);
	}

	lines.push('---');
	lines.push('');

	return lines.join('\n') + '\n' + content; // eslint-disable-line prefer-template
}

function processMarkdown(file, { rewriter }) {
	const content = remark()
		.use(remarkGFM)
		.use(rewriteLink, { rewriter })
		.use(wrapProblemExample)
		.use(makeRuleSymbolsAccessbile)
		.use(jsoncToJson)
		.processSync(fs.readFileSync(file, 'utf8'))
		.toString();

	// Add Docusaurus-specific fields. See https://docusaurus.io/docs/en/doc-markdown
	let title = content.match(/\n?# ([^\n]+)\n/)[1];
	let slug;

	const titleToSidebarLabel = {
		Stylelint: 'Home',
	};

	const sidebarLabel = titleToSidebarLabel[title] || title;

	// Check for homepage
	if (title === 'Stylelint') {
		title = sidebarLabel;
		slug = '/';
	}

	return insertFrontMatter(content, {
		title,
		sidebar_label: sidebarLabel,
		slug,
	});
}

function main(outputDir) {
	fs.rmSync(outputDir, { force: true, recursive: true });
	fs.mkdirSync(outputDir);

	glob.sync('node_modules/stylelint/*.md').forEach((file) => {
		const output = processMarkdown(file, {
			rewriter: (url) => url.replace(/^\/?docs\//, '/').replace('README.md', 'index.md'),
		});

		const outputFile = path.join(
			outputDir,
			file.replace('node_modules/stylelint', '').replace('README.md', 'index.md'),
		);

		fs.mkdirSync(path.dirname(outputFile), { recursive: true });
		fs.writeFileSync(outputFile, output, 'utf8');
	});

	glob.sync('node_modules/stylelint/docs/**/!(toc).md').forEach((file) => {
		const output = processMarkdown(file, {
			rewriter: (url) =>
				url
					.replace(
						/\.\.\/\.\.\/lib\/rules\/([a-z-]+\.[a-z]+)/,
						'https://github.com/stylelint/stylelint/blob/main/lib/rules/$1',
					)
					.replace(
						/\.\.\/\.\.\/types\/stylelint\/([a-z.]+)/,
						'https://github.com/stylelint/stylelint/blob/main/types/stylelint/$1',
					)
					.replace('../../CHANGELOG.md', '../CHANGELOG.md')
					.replace('../../VISION.md', '../VISION.md')
					.replace('../../lib/rules/', '/user-guide/rules/')
					.replace('/README.md', '.md')
					.replace('CONTRIBUTING.md', 'CONTRIBUTING')
					.replace(/\/awesome-stylelint\/?#readme$/, '/awesome-stylelint')
					.replace(
						/^https:\/\/github.com\/stylelint\/awesome-stylelint(#.+)?$/,
						'/awesome-stylelint.md$1',
					),
		});

		const outputFile = path.join(outputDir, file.replace('node_modules/stylelint/docs', ''));

		fs.mkdirSync(path.dirname(outputFile), { recursive: true });

		fs.writeFileSync(outputFile, output, 'utf8');
	});

	glob.sync('node_modules/stylelint/lib/rules/**/*.md').forEach((file) => {
		const output = processMarkdown(file, {
			rewriter: (url) =>
				url
					.replace(/\.\.\/([a-z-]+)\/README.md/, '$1.md')
					.replace(/\.\.\/\.\.\/\.\.\/docs\/user-guide\/([a-z-/]+)\.md/, '../$1.md'),
		});

		const outputFile = path.join(
			outputDir,
			file
				.replace('node_modules/stylelint/lib/rules', 'user-guide/rules')
				.replace('/README.md', '.md'),
		);

		fs.mkdirSync(path.dirname(outputFile), { recursive: true });

		fs.writeFileSync(outputFile, output, 'utf8');
	});

	glob.sync('node_modules/stylelint/*.png').forEach((imagePath) => {
		const dest = path.join(outputDir, imagePath.replace('node_modules/stylelint/', ''));

		fs.copyFileSync(imagePath, dest);
	});

	glob.sync('node_modules/awesome-stylelint/README.md').forEach((src) => {
		const dest = path.join(outputDir, 'awesome-stylelint.md');

		fs.copyFileSync(src, dest);

		const content = fs.readFileSync(dest, 'utf8');
		const newContent = insertFrontMatter(content, {
			title: 'Awesome Stylelint',
			sidebar_label: 'Awesome',
		});

		fs.writeFileSync(dest, newContent);
	});

	console.log(`Documents have been generated to '${outputDir}'.`); // eslint-disable-line no-console
}

main(process.argv[2]);
