const unified = require("unified");
const markdown = require("remark-parse");
const fs = require("fs");
const util = require("util");
const mdxPlugin = require("./mdx-plugin");
const treeMap = require("unist-util-map");
var acorn = require("acorn");
var jsx = require("acorn-jsx");

const EMPTY_NEWLINE = "\n\n";
const IMPORT_REGEX = /^import/;
const EXPORT_REGEX = /^export/;
const EXPORT_DEFAULT_REGEX = /^export default/;

const isImport = text => IMPORT_REGEX.test(text);
const isExport = text => EXPORT_REGEX.test(text);
const isExportDefault = text => EXPORT_DEFAULT_REGEX.test(text);

const tokenizeEsSyntax = (eat, value) => {
  const index = value.indexOf(EMPTY_NEWLINE);
  const subvalue = index !== -1 ? value.slice(0, index) : value;

  if (isExport(subvalue) || isImport(subvalue)) {
    return eat(subvalue)({
      type: isExport(subvalue) ? "export" : "import",
      default: isExportDefault(subvalue),
      value: subvalue
    });
  }
};

tokenizeEsSyntax.locator = (value, fromIndex) => {
  return isExport(value) || isImport(value) ? -1 : 1;
};

function esSyntax() {
  var Parser = this.Parser;
  var tokenizers = Parser.prototype.blockTokenizers;
  var methods = Parser.prototype.blockMethods;

  tokenizers.esSyntax = tokenizeEsSyntax;

  methods.splice(methods.indexOf("paragraph"), 0, "esSyntax");
}

const jsxParser = acorn.Parser.extend(jsx());

const mdxString = fs.readFileSync("./fixture.mdx", "utf-8");

const processor = unified()
  .use(markdown)
  .use(esSyntax);

const run = async function() {
  const tree = await processor.parse(mdxString);
  unified().run(tree, function(err, newTree) {
    const updateTree = treeMap(newTree, node => {
      let jsxCheck;
      try {
        if (node.children > 1) {
          const childAsStringCheck = map(function(elem) {
            return elem.value;
          }).join("");
        }
        jsxCheck = jsxParser.parse(node.value, { sourceType: "module" });
        if (jsxCheck.body[0].type === "ImportDeclaration") {
          return Object.assign({}, node, { type: "import" });
        }
        if (jsxCheck.body[0].type === "ExportDeclaration") {
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
        // console.log("Error:", e);
      }

      return node;
    });
    console.log(
      util.inspect(updateTree, false, null, true /* enable colors */)
    );
  });
};

run();
