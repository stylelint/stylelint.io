/* globals module */
/**
 * rehype plugin that gives `crossorigin` attribute to img tag.
 *
 * We need to use Cross-Origin-Embedder-Policy=require-corp for the Demo site to work.
 * However, this prevents cross-origin images from loading without the crossorigin attribute.
 * This plugin adds the crossorigin attribute to the img tag so that images can be loaded.
 *
 * see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin
 *
 * @type {import('unified').Plugin}
 */
const rehypePluginCrossOriginAttrs = () => {
	return (tree) => {
		visitElements(
			tree,
			/**
			 * @param {import('hast').Element} node
			 */
			(node) => {
				if (node.tagName === 'img') {
					node.properties = { ...node.properties, crossOrigin: 'anonymous' };
				}
			},
		);
	};
};

module.exports = rehypePluginCrossOriginAttrs;

function visitElements(tree, visitor) {
	const buffer = [tree];
	let node = buffer.pop();

	while (node) {
		if (node.type === 'element') {
			visitor(node);
		}

		if (Array.isArray(node.children)) {
			buffer.push(...[...node.children].reverse());
		}

		node = buffer.pop();
	}
}
