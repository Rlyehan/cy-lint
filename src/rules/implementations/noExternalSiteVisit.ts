import * as ts from "typescript";
import { Violation } from "../../types/violations";

export function noExternalSiteVisit(node: ts.Node): Violation[] {
  const violations: Violation[] = [];

  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    node.expression.expression.getText() === "cy" &&
    node.expression.name.getText() === "visit" &&
    node.arguments.length === 1 &&
    ts.isStringLiteral(node.arguments[0])
  ) {
    const url = node.arguments[0].getText().replace(/['"]/g, "");
    const isExternal = /^(https?:\/\/)/.test(url);

    if (isExternal) {
      const line =
        ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart())
          .line + 1;
      violations.push({
        filepath: node.getSourceFile().fileName,
        line: line,
        description:
          "Avoid visiting external sites or servers you do not control",
      });
    }
  }

  return violations;
}
