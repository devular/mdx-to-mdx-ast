const util = require("util");
const fs = require("fs");
const mdxToMdxAst = require("./index");

const mdxString = fs.readFileSync("./fixture.mdx", "utf-8");

const test = async function() {
  const mdxAst = await mdxToMdxAst(mdxString);

  console.log(util.inspect(mdxAst, false, null, true /* enable colors */));
};
test();
