import * as ts from "typescript";
import { Violation } from "../../types/violations";

export function avoidCommandReturnValueAssignments(node: ts.Node): Violation[] {
  const violations: Violation[] = [];

  if (
    ts.isVariableDeclaration(node) &&
    node.initializer &&
    ts.isCallExpression(node.initializer)
  ) {
    const callExpression = node.initializer;

    if (
      ts.isPropertyAccessExpression(callExpression.expression) &&
      callExpression.expression.expression.getText() === "cy"
    ) {
      const sourceFile = node.getSourceFile();
      const line =
        ts.getLineAndCharacterOfPosition(sourceFile, node.getStart()).line + 1;

      violations.push({
        filepath: sourceFile.fileName,
        line: line,
        description:
          "Avoid assigning the return value of Cypress commands with const, let, or var",
      });
    }
  }

  return violations;
}