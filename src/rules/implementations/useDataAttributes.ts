import * as ts from "typescript";

export function useDataAttributes(node: ts.Node, config: any): any[] {
  const violations: any[] = [];

  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    node.expression.expression.getText() === "cy" &&
    node.expression.name.getText() === "get" &&
    node.arguments.length === 1 &&
    ts.isStringLiteral(node.arguments[0]) &&
    !node.arguments[0].text.includes('data-')
  ) {
    const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart()).line + 1;
    violations.push({
      filepath: node.getSourceFile().fileName,
      line: line,
      description: "Use data-* attributes for selecting elements.",
    });
  }

  return violations;
}
