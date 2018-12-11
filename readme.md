# MDX to MDX AST

Hello there,

This library was written for educational purposes.

It exports one `async function` that takes an MDX string and returns an MDXAST spec tree.

Here is the spec: https://github.com/mdx-js/specification

## Why?

- The official MDX package does not export a method for generating an MDXAST spec tree
- The official MDX package uses regexes and assumptions around remark parsing of HTML to specifify JSX, import, and export nodes
- I wanted to use Acorn to verify JSX nodes and esSytax nodes on the tree
- For fun and learning

## Running

`yarn install && yarn test` to run the package against `test/fixture.mdx`

## Notes

- The EsSyntax tokenizer is taken straight from the MDX-JS/MDX library.
- Tests to come

