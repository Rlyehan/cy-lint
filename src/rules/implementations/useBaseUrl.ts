import * as ts from 'typescript';

function isFullUrl(url: string): boolean {
  const regex = new RegExp(/^(https?:\/\/|\/\/)/);
  return regex.test(url);
}

export function useBaseUrl(node: ts.Node, config: any): any[] {
  const violations: any[] = [];

  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    ts.isIdentifier(node.expression.expression) &&
    ts.isIdentifier(node.expression.name) &&
    node.expression.expression.text === 'cy' &&
    node.expression.name.text === 'visit'
  ) {
    const [urlNode] = node.arguments;

    if (ts.isStringLiteral(urlNode) && isFullUrl(urlNode.text)) {
      const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart()).line + 1;
      violations.push({
        filepath: node.getSourceFile().fileName,
        line: line,
        description: 'Use base URL from config instead of full URLs',
      });
    }
  }

  return violations;
}
