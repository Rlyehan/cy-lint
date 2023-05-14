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
exports.atLeastOneAssertion = void 0;
const ts = __importStar(require("typescript"));
function isAssertion(node) {
    if (ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.name.text === "should") {
        return true;
    }
    if (ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === "expect") {
        return true;
    }
    return false;
}
function hasAssertionsInNode(node, check) {
    let hasAssertion = false;
    ts.forEachChild(node, (child) => {
        if (check(child) || hasAssertionsInNode(child, check)) {
            hasAssertion = true;
        }
    });
    return hasAssertion;
}
function atLeastOneAssertion(node) {
    const violations = [];
    if (ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === "it") {
        const [, callback] = node.arguments;
        if (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback)) {
            const hasAssertion = hasAssertionsInNode(callback.body, isAssertion);
            if (!hasAssertion) {
                const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart()).line + 1;
                violations.push({
                    filepath: node.getSourceFile().fileName,
                    line: line,
                    description: "There should be at least one assertion in each it block",
                });
            }
        }
    }
    return violations;
}
exports.atLeastOneAssertion = atLeastOneAssertion;
