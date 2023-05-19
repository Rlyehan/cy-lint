import * as ts from "typescript";
import { Violation } from "../../types/violations";

function isHardcodedCredentials(node: ts.Node): boolean {
  if (
    !ts.isCallExpression(node) ||
    !ts.isPropertyAccessExpression(node.expression)
  ) {
    return false;
  }

  const propertyName = node.expression.name.text;
  if (propertyName !== "type") {
    return false;
  }

  const object = node.expression.expression;
  if (
    !ts.isCallExpression(object) ||
    !ts.isPropertyAccessExpression(object.expression)
  ) {
    return false;
  }

  const getObjectPropertyName = object.expression.name.text;
  if (getObjectPropertyName !== "get") {
    return false;
  }

  const firstArgument = object.arguments[0];
  if (!ts.isStringLiteral(firstArgument)) {
    return false;
  }

  const selector = firstArgument.text;
  const targetSelectors = [
    "#username",
    "#password",
    '[name="username"]',
    '[name="password"]',
  ];
  if (!targetSelectors.includes(selector)) {
    return false;
  }

  const typeArgument = node.arguments[0];
  return ts.isStringLiteral(typeArgument);
}

function isHardcodedStringVariable(node: ts.Node): boolean {
  if (
    !ts.isVariableDeclaration(node) ||
    !ts.isIdentifier(node.name) ||
    !node.initializer
  ) {
    return false;
  }

  const variableName = node.name.text;
  const targetNames = ["username", "password"];
  if (!targetNames.includes(variableName)) {
    return false;
  }

  return ts.isStringLiteral(node.initializer);
}

export function noHardcodedCredentials(node: ts.Node): Violation[] {
  const violations: Violation[] = [];
  const sourceFile = node.getSourceFile();
  const line =
    ts.getLineAndCharacterOfPosition(sourceFile, node.getStart()).line + 1;

  if (isHardcodedCredentials(node) || isHardcodedStringVariable(node)) {
    violations.push({
      filepath: sourceFile.fileName,
      line: line,
      description:
        "Avoid using hardcoded credentials in tests, use environment variables or fixtures instead",
    });
  }

  return violations;
}
