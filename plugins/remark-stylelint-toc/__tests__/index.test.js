import remark from "remark";
import stylelintToc from "../";

const content = `bbb

## Options

### \`"always"\`

ccc

### \`"never"\`

ddd

## Optional secondary options

### \`except: ["after-comment", "after-declaration", "first-nested"]\`

#### \`"after-comment"\`

eee

#### \`"after-declaration"\`

fff`;

test(`don't generate TOC`, () => {
  expect(run(content)).toMatchSnapshot();
});

test(`generate on a rule page before Options`, () => {
  expect(run(content, "RulePage")).toMatchSnapshot();
});

test(`generate on a rule page if comment exist`, () => {
  expect(
    run(`# aaa\n\n<!-- TOC -->\n\n## ab\n\n${content}`, "RulePage")
  ).toMatchSnapshot();
});

test(`generate on a any page if comment exist`, () => {
  expect(run(`# aaa\n\n<!-- TOC -->\n\n## ab\n\n${content}`)).toMatchSnapshot();
});

function run(content, layout) {
  return remark()
    .use(stylelintToc, { layout })
    .process(content).contents;
}
