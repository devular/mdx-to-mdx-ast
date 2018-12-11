const unified = require("unified");
const markdown = require("remark-parse");
const fs = require("fs");
const flatMap = require("unist-util-flatmap");
const acorn = require("acorn");
const jsx = require("acorn-jsx");
const util = require("util");

const {
  jsNodeIsExport,
  jsNodeIsImport,
  jsNodeIsJsxElement
} = require("./utils");
const esSyntax = require("./es-syntax-plugin");
var { handleMultiProgramNodes } = require("./handle-multi-program-nodes");

const jsxParser = acorn.Parser.extend(jsx());

const processor = unified()
  .use(markdown)
  .use(esSyntax);

module.exports = async function(mdxString) {
  const markdownAstWithTokenizedEsSyntax = processor.parse(mdxString);
  const partialTree = await unified().run(markdownAstWithTokenizedEsSyntax);
  const mdxAst = flatMap(partialTree, node => {
    try {
      // Parse each node with Acorn JSX parser (powers Babel)
      const jsxCheck = jsxParser.parse(node.value, {
        sourceType: "module"
      });
      if (jsxCheck.body.length > 1) {
        return jsxCheck.body.map(node => {
          return handleMultiProgramNodes(node);
        });
      }
      if (jsNodeIsImport(jsxCheck.body[0])) {
        return [Object.assign({}, node, { type: "import" })];
      }
      if (jsNodeIsExport(jsxCheck.body[0])) {
        return [Object.assign({}, node, { type: "export" })];
      }
      if (jsNodeIsJsxElement(jsxCheck.body[0])) {
        return [Object.assign({}, node, { type: "jsx" })];
      }
    } catch (e) {
      if (!(e instanceof SyntaxError)) {
        console.error(e);
      }
      // Ignore nodes that are not parseable as JSX
    }

    return [node];
  });

  return mdxAst;
};
