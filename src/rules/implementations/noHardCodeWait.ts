import * as ts from "typescript";

export function noHardcodedWait(node: ts.Node, config: any): any[] {
    const violations: any[] = [];

    if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.expression.getText() === "cy" &&
        node.expression.name.getText() === "wait" &&
        node.arguments.length === 1 &&
        ts.isNumericLiteral(node.arguments[0])
    ) {
        const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart()).line + 1;
        violations.push({
            filepath: node.getSourceFile().fileName,
            line: line,
            description: "Avoid using hardcoded wait times"
        });
    }
    
    return violations;
}

