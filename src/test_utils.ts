import * as ts from "typescript";

export function traverseAst(
  code: string,
  callback: (node: ts.Node) => void
): void {
  const sourceFile = ts.createSourceFile(
    "test.ts",
    code,
    ts.ScriptTarget.ES2015,
    true,
    ts.ScriptKind.TS
  );

  function visit(node: ts.Node): void {
    callback(node);
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}
