import * as ts from "typescript";
import { Violation } from '../../types/violations';


function findCyExecOrTask(node: ts.Node): ts.CallExpression[] {
  const cyExecOrTaskCalls: ts.CallExpression[] = [];
  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    ts.isIdentifier(node.expression.expression) &&
    node.expression.expression.text === 'cy'
  ) {
    const method = node.expression.name.text;
    if (method === 'exec' || method === 'task') {
      cyExecOrTaskCalls.push(node);
    }
  }
  return cyExecOrTaskCalls;
}

function findCyExecOrTaskRecursively(node: ts.Node): ts.CallExpression[] {
  let calls: ts.CallExpression[] = [];
  ts.forEachChild(node, (child) => {
    calls = calls.concat(findCyExecOrTask(child));
    calls = calls.concat(findCyExecOrTaskRecursively(child));
  });
  return calls;
}

export function noWebServerInCypress(node: ts.Node): Violation[] {
  const violations: Violation[] = [];

  if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'describe') {
    const [, callback] = node.arguments;
    if (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback)) {
      const cyExecOrTaskCalls = findCyExecOrTaskRecursively(callback.body);
      for (const cyCall of cyExecOrTaskCalls) {
        const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), cyCall.getStart()).line + 1;
        violations.push({
          filepath: node.getSourceFile().fileName,
          line: line,
          description: "Do not start a web server from within Cypress scripts with cy.exec() or cy.task()"
        });
      }
    }
  }

  return violations;
}
