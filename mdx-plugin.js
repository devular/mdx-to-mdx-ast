var visit = require("unist-util-visit");

module.exports = attacher;

function attacher() {
  function transformer(tree, file) {
    console.log({ tree, file });
    visit(tree, "Paragraph", visitor);

    function visitor(node) {
      console.log(node);
    }
  }
  return transformer;
}
