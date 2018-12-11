const util = require("util");
const fs = require("fs");
const path = require("path");
const mdxToMdxAst = require("../index");

const fixturePath = path.resolve(__dirname, "fixture.mdx");
const mdxString = fs.readFileSync(fixturePath, "utf-8");

const test = async function() {
  const mdxAst = await mdxToMdxAst(mdxString);

  console.log(util.inspect(mdxAst, false, null, true /* enable colors */));
};
test();
