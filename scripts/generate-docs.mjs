import * as fs from 'fs';
import { default as glob } from 'glob';
import * as path from 'path';
import { default as remark } from 'remark';
import { visit } from 'unist-util-visit';

function processMarkdown(file, { rewriter }) {
	function rewriteLink(options) {
		function visitor(node) {
			node.url = options.rewriter(node.url);
		}

		function transform(tree) {
			visit(tree, ['link'], visitor);
		}

		return transform;
	}

	const content = remark()
		.use(rewriteLink, { rewriter })
		.processSync(fs.readFileSync(file, 'utf8'))
		.toString();

	// Add Docusaurus-specific fields. See https://docusaurus.io/docs/en/doc-markdown
	let title = content.match(/\n?# ([^\n]+)\n/)[1];
	let slug;

	const titleToSidebarLabel = {
		stylelint: 'Home',
	};

	const sidebarLabel = titleToSidebarLabel[title] || title;

	// Check for homepage
	if (title === 'stylelint') {
		title = sidebarLabel;
		slug = '/';
	}

	const meta = [
		['title', title],
		['sidebar_label', sidebarLabel],
	];

	if (slug) meta.push(['slug', slug]);

	let frontMatter = '---\n';

	for (const item of meta) {
		frontMatter += `${item[0]}: ${item[1]}\n`;
	}

	frontMatter += '---';

	return `${frontMatter}\n\n${content}`;
}

function main(outputDir) {
	fs.mkdirSync(outputDir);

	glob.sync('node_modules/stylelint/*.md').forEach((file) => {
		let output = processMarkdown(file, {
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
						'../../lib/rules/index.js',
						'https://github.com/stylelint/stylelint/blob/master/lib/rules/index.js',
					)
					.replace('../../CHANGELOG.md', '../CHANGELOG.md')
					.replace('../../VISION.md', '../VISION.md')
					.replace('../../lib/rules/', 'rules/list/')
					.replace('/README.md', '.md')
					.replace('CONTRIBUTING.md', 'CONTRIBUTING'),
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
					.replace(/\.\.\/\.\.\/\.\.\/docs\/user-guide\/([a-z-/]+)\.md/, '../../$1.md'),
		});

		const outputFile = path.join(
			outputDir,
			file
				.replace('node_modules/stylelint/lib/rules', 'user-guide/rules/list')
				.replace('/README.md', '.md'),
		);

		fs.mkdirSync(path.dirname(outputFile), { recursive: true });

		fs.writeFileSync(outputFile, output, 'utf8');
	});

	console.log('Documents have been generated.'); // eslint-disable-line no-console
}

main(process.argv[2]);
