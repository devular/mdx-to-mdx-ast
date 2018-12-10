const EMPTY_NEWLINE = "\n\n";
const IMPORT_REGEX = /^import/;
const EXPORT_REGEX = /^export/;

const isImport = text => IMPORT_REGEX.test(text);
const isExport = text => EXPORT_REGEX.test(text);

const tokenizeEsSyntax = (eat, value) => {
  const index = value.indexOf(EMPTY_NEWLINE);
  const subvalue = index !== -1 ? value.slice(0, index) : value;

  if (isExport(subvalue) || isImport(subvalue)) {
    return eat(subvalue)({
      type: "esSyntax",
      value: subvalue
    });
  }
};

tokenizeEsSyntax.locator = (value, fromIndex) => {
  return isExport(value) || isImport(value) ? -1 : 1;
};

module.exports = function() {
  var Parser = this.Parser;
  var tokenizers = Parser.prototype.blockTokenizers;
  var methods = Parser.prototype.blockMethods;

  tokenizers.esSyntax = tokenizeEsSyntax;

  methods.splice(methods.indexOf("paragraph"), 0, "esSyntax");
};
