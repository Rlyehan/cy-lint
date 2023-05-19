import * as ts from "typescript";
import { Violation } from "../../types/violations";

export function noHardcodedWait(node: ts.Node): Violation[] {
  const violations: Violation[] = [];

  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression)
  ) {
    const callExp = node.expression;
    if (
      callExp.expression.getText() === "cy" &&
      callExp.name.getText() === "wait" &&
      node.arguments.length === 1 &&
      ts.isNumericLiteral(node.arguments[0])
    ) {
      const line =
        ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart())
          .line + 1;
      violations.push({
        filepath: node.getSourceFile().fileName,
        line: line,
        description: "Avoid using hardcoded wait times",
      });
    }
  }

  return violations;
}
