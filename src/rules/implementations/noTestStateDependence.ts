import * as ts from "typescript";
import { Violation } from "../../types/violations";

function hasBeforeEach(node: ts.Node): boolean {
  return ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "beforeEach";
}

function hasBeforeEachInChildren(node: ts.Node): boolean {
  let hasBeforeEachHook = false;

  node.forEachChild((child) => {
    if (hasBeforeEach(child) || hasBeforeEachInChildren(child)) {
      hasBeforeEachHook = true;
    }
  });

  return hasBeforeEachHook;
}

export function noTestStateDependence(node: ts.Node): Violation[] {
  const violations: Violation[] = [];

  if (
    !ts.isCallExpression(node) ||
    !ts.isIdentifier(node.expression) ||
    node.expression.text !== "describe"
  ) {
    return violations;
  }

  const [, callback] = node.arguments;

  if (!ts.isArrowFunction(callback) && !ts.isFunctionExpression(callback)) {
    return violations;
  }

  if (!ts.isBlock(callback.body)) {
    return violations;
  }

  const hasBeforeEachHook = hasBeforeEachInChildren(callback.body);
  const itCalls = callback.body.statements.filter((statement) => {
    if (!ts.isExpressionStatement(statement)) {
      return false;
    }
    const expr = statement.expression;
    return (
      ts.isCallExpression(expr) &&
      ts.isIdentifier(expr.expression) &&
      expr.expression.text === "it"
    );
  });

  if (itCalls.length > 1 && !hasBeforeEachHook) {
    const line =
      ts.getLineAndCharacterOfPosition(
        node.getSourceFile(),
        node.getStart()
      ).line + 1;
    violations.push({
      filepath: node.getSourceFile().fileName,
      line: line,
      description: "Avoid having tests rely on the state of previous tests",
    });
  }

  return violations;
}
