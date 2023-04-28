import * as ts from "typescript";

export function avoidCommandReturnValueAssignments(node: ts.Node, config: any): any[] {
  const violations: any[] = [];

  if (
    ts.isVariableDeclaration(node) &&
    node.initializer &&
    ts.isCallExpression(node.initializer) &&
    ts.isPropertyAccessExpression(node.initializer.expression) &&
    node.initializer.expression.expression.getText() === "cy"
  ) {
    const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart()).line + 1;
    violations.push({
      filepath: node.getSourceFile().fileName,
      line: line,
      description: "Avoid assigning the return value of Cypress commands with const, let, or var"
    });
  }

  return violations;
}