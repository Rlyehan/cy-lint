import * as ts from "typescript";

function hasBeforeEach(node: ts.Node): boolean {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      if (node.expression.text === 'beforeEach') {
        return true;
      }
    }
    return false;
  }
  
  export function noTestStateDependence(node: ts.Node, config: any): any[] {
    const violations: any[] = [];
  
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'describe') {
      const [, callback] = node.arguments;
      if (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback)) {
        if (ts.isBlock(callback.body)) {
          const hasBeforeEachHook = callback.body.statements.some(hasBeforeEach);
          const itCalls = callback.body.statements.filter(statement =>
            ts.isExpressionStatement(statement) &&
            ts.isCallExpression(statement.expression) &&
            ts.isIdentifier(statement.expression.expression) &&
            statement.expression.expression.text === 'it'
          );
          if (itCalls.length > 1 && !hasBeforeEachHook) {
            const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart()).line + 1;
            violations.push({
              filepath: node.getSourceFile().fileName,
              line: line,
              description: "Avoid having tests rely on the state of previous tests"
            });
          }
        }
      }
    }
  
    return violations;
  }
  
