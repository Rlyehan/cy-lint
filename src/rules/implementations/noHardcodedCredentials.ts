import * as ts from 'typescript';
import { Violation } from '../../types/violations';

function isHardcodedCredentials(node: ts.Node): boolean {
  if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
    const propertyName = node.expression.name.text;
    if (propertyName === 'type') {
      const object = node.expression.expression;
      if (ts.isCallExpression(object) && ts.isPropertyAccessExpression(object.expression)) {
        const getObjectPropertyName = object.expression.name.text;
        if (getObjectPropertyName === 'get') {
          const firstArgument = object.arguments[0];
          if (ts.isStringLiteral(firstArgument)) {
            const selector = firstArgument.text;
            const targetSelectors = ['#username', '#password', '[name="username"]', '[name="password"]'];
            if (targetSelectors.includes(selector)) {
              const typeArgument = node.arguments[0];
              return ts.isStringLiteral(typeArgument);
            }
          }
        }
      }
    }
  }
  return false;
}

export function noHardcodedCredentials(node: ts.Node): Violation[] {
  const violations: Violation[] = [];

  if (isHardcodedCredentials(node)) {
    const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart()).line + 1;
    violations.push({
      filepath: node.getSourceFile().fileName,
      line: line,
      description: 'Avoid using hardcoded credentials in tests, use environment variables or fixtures instead',
    });
  }

  return violations;
}
