/**
 * Use first line of markdown file as head.title
 */

export default (
  {
    result,
    frontMatter,
  }
) => {
  if (result.head && result.head.title) {
    return result
  }
  return {
    ...result,
    head: {
      ...result.head,
      title: frontMatter.content.split('\n')[0].replace("# ", ""),
    },
  }
}
