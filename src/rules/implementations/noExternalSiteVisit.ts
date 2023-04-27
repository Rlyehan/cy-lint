import * as ts from "typescript";

export function noExternalSiteVisit(node: ts.Node, config: any): any[] {
  const violations: any[] = [];

  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    node.expression.expression.getText() === "cy" &&
    node.expression.name.getText() === "visit" &&
    node.arguments.length === 1 &&
    ts.isStringLiteral(node.arguments[0])
  ) {
    const url = node.arguments[0].getText().replace(/['"]/g, '');
    const isExternal = /^(https?:\/\/)/.test(url);
    
    if (isExternal) {
      const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart()).line + 1;
      violations.push({
        filepath: node.getSourceFile().fileName,
        line: line,
        description: "Avoid visiting external sites or servers you do not control"
      });
    }
  }

  return violations;
}
