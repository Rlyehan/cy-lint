import * as ts from "typescript";
import { Violation } from "../../types/violations";

export function avoidTagClassIdSelectors(node: ts.Node): Violation[] {
  const violations: Violation[] = [];

  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    node.expression.expression.getText() === "cy" &&
    node.expression.name.getText() === "get" &&
    node.arguments.length === 1 &&
    ts.isStringLiteral(node.arguments[0])
  ) {
    const selector = node.arguments[0].getText().slice(1, -1);

    if (
      selector.startsWith("#") ||
      selector.startsWith(".") ||
      /^[a-zA-Z0-9]+$/.test(selector)
    ) {
      const line =
        ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart())
          .line + 1;
      violations.push({
        filepath: node.getSourceFile().fileName,
        line: line,
        description: `Avoid using tag, class, or ID selectors. Found: '${selector}'`,
      });
    }
  }

  return violations;
}
