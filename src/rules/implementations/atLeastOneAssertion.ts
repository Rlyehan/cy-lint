import * as ts from "typescript";
import { Violation } from "../../types/violations";

function isAssertion(node: ts.Node): boolean {
  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    node.expression.name.text === "should"
  ) {
    return true;
  }

  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === "expect"
  ) {
    return true;
  }

  return false;
}

function hasAssertionsInNode(
  node: ts.Node,
  check: (node: ts.Node) => boolean
): boolean {
  let hasAssertion = false;

  ts.forEachChild(node, (child) => {
    if (check(child) || hasAssertionsInNode(child, check)) {
      hasAssertion = true;
    }
  });

  return hasAssertion;
}

export function atLeastOneAssertion(node: ts.Node): Violation[] {
  const violations: Violation[] = [];

  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === "it"
  ) {
    const [, callback] = node.arguments;

    if (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback)) {
      const hasAssertion = hasAssertionsInNode(callback.body, isAssertion);

      if (!hasAssertion) {
        const line =
          ts.getLineAndCharacterOfPosition(
            node.getSourceFile(),
            node.getStart()
          ).line + 1;
        violations.push({
          filepath: node.getSourceFile().fileName,
          line: line,
          description:
            "There should be at least one assertion in each it block",
        });
      }
    }
  }

  return violations;
}
