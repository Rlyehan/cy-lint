import * as ts from "typescript";
import { Violation } from "../../types/violations";

export function useDataAttributes(node: ts.Node): Violation[] {
  const violations: Violation[] = [];

  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    node.expression.expression.getText() === "cy" &&
    node.expression.name.getText() === "get" &&
    node.arguments.length === 1 &&
    ts.isStringLiteral(node.arguments[0]) &&
    !/[dD][aA][tT][aA]-/.test(node.arguments[0].text)
  ) {
    const line =
      ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart())
        .line + 1;
    violations.push({
      filepath: node.getSourceFile().fileName,
      line: line,
      description: "Use data-* attributes for selecting elements.",
    });
  }

  return violations;
}
