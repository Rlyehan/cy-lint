"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noHardcodedCredentials = void 0;
const ts = __importStar(require("typescript"));
function isHardcodedCredentials(node) {
    if (ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression)) {
        const propertyName = node.expression.name.text;
        if (propertyName === "type") {
            const object = node.expression.expression;
            if (ts.isCallExpression(object) &&
                ts.isPropertyAccessExpression(object.expression)) {
                const getObjectPropertyName = object.expression.name.text;
                if (getObjectPropertyName === "get") {
                    const firstArgument = object.arguments[0];
                    if (ts.isStringLiteral(firstArgument)) {
                        const selector = firstArgument.text;
                        const targetSelectors = [
                            "#username",
                            "#password",
                            '[name="username"]',
                            '[name="password"]',
                        ];
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
function noHardcodedCredentials(node) {
    const violations = [];
    if (isHardcodedCredentials(node)) {
        const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart())
            .line + 1;
        violations.push({
            filepath: node.getSourceFile().fileName,
            line: line,
            description: "Avoid using hardcoded credentials in tests, use environment variables or fixtures instead",
        });
    }
    return violations;
}
exports.noHardcodedCredentials = noHardcodedCredentials;
