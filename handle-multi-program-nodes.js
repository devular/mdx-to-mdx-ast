const escodegen = require("escodegen");
const {
  jsNodeIsExport,
  jsNodeIsImport,
  jsNodeIsJsxElement
} = require("./utils");

module.exports.handleMultiProgramNodes = function(jsNode) {
  const value = escodegen.generate(jsNode);
  let type;
  if (jsNodeIsImport(jsNode)) {
    return Object.assign({
      type: "import",
      value: value
    });
  } else if (jsNodeIsExport(jsNode)) {
    return Object.assign({
      type: "export",
      value: value
    });
  } else {
    console.log(
      Object.assign({
        type: "esSyntax",
        value: escodegen.generate(jsNode)
      })
    );
    throw new Error("Unsupported ES Syntax");
  }
};
