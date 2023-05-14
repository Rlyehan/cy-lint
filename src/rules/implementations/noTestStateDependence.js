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
exports.noTestStateDependence = void 0;
const ts = __importStar(require("typescript"));
function hasBeforeEach(node) {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
        if (node.expression.text === "beforeEach") {
            return true;
        }
    }
    return false;
}
function hasBeforeEachInChildren(node) {
    let hasBeforeEachHook = false;
    node.forEachChild((child) => {
        if (hasBeforeEach(child)) {
            hasBeforeEachHook = true;
        }
        else {
            hasBeforeEachHook = hasBeforeEachHook || hasBeforeEachInChildren(child);
        }
    });
    return hasBeforeEachHook;
}
function noTestStateDependence(node) {
    const violations = [];
    if (ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === "describe") {
        const [, callback] = node.arguments;
        if (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback)) {
            if (ts.isBlock(callback.body)) {
                const hasBeforeEachHook = hasBeforeEachInChildren(callback.body);
                const itCalls = callback.body.statements.filter((statement) => ts.isExpressionStatement(statement) &&
                    ts.isCallExpression(statement.expression) &&
                    ts.isIdentifier(statement.expression.expression) &&
                    statement.expression.expression.text === "it");
                if (itCalls.length > 1 && !hasBeforeEachHook) {
                    const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart()).line + 1;
                    violations.push({
                        filepath: node.getSourceFile().fileName,
                        line: line,
                        description: "Avoid having tests rely on the state of previous tests",
                    });
                }
            }
        }
    }
    return violations;
}
exports.noTestStateDependence = noTestStateDependence;
