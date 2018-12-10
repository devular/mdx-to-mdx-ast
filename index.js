const unified = require("unified");
const markdown = require("remark-parse");
const fs = require("fs");
const treeMap = require("unist-util-map");
const acorn = require("acorn");
const jsx = require("acorn-jsx");
const esSyntax = require("./es-syntax-plugin");
const util = require("util");

const jsxParser = acorn.Parser.extend(jsx());

const processor = unified()
  .use(markdown)
  .use(esSyntax);

module.exports = async function(mdxString) {
  const markdownAstWithTokenizedEsSyntax = processor.parse(mdxString);
  const partialTree = await unified().run(markdownAstWithTokenizedEsSyntax);
  const mdxAst = treeMap(partialTree, node => {
    try {
      // Parse eachg node with Acorn JSX parser (powers Bable)
      const jsxCheck = jsxParser.parse(node.value, {
        sourceType: "module"
      });
      if (jsxCheck.body[0].type === "ImportDeclaration") {
        return Object.assign({}, node, { type: "import" });
      }
      if (
        jsxCheck.body[0].type === "ExportDeclaration" ||
        jsxCheck.body[0].type === "ExportDefaultDeclaration" ||
        jsxCheck.body[0].type === "ExportNamedDeclaration" ||
        jsxCheck.body[0].type === "ExportAllDeclaration"
      ) {
        return Object.assign({}, node, { type: "export" });
      }
      if (
        jsxCheck.type === "Program" &&
        jsxCheck.body[0].type === "ExpressionStatement" &&
        jsxCheck.body[0].expression.type === "JSXElement"
      ) {
        return Object.assign({}, node, { type: "jsx" });
      }
    } catch (e) {
      // Ignore nodes that are not parseable as JSX
    }

    return node;
  });

  return mdxAst;
};
