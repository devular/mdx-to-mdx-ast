module.exports.jsNodeIsJsxElement = function(jsNode) {
  if (
    jsNode.type === "ExpressionStatement" &&
    jsNode.expression.type === "JSXElement"
  ) {
    return true;
  }
  return false;
};

module.exports.jsNodeIsImport = function(jsNode) {
  if (jsNode.type === "ImportDeclaration") {
    return true;
  }
  return false;
};

module.exports.jsNodeIsExport = function(jsNode) {
  if (
    jsNode.type === "ExportDeclaration" ||
    jsNode.type === "ExportDefaultDeclaration" ||
    jsNode.type === "ExportNamedDeclaration" ||
    jsNode.type === "ExportAllDeclaration"
  ) {
    return true;
  }
  return false;
};
