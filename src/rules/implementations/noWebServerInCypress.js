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
exports.noWebServerInCypress = void 0;
const ts = __importStar(require("typescript"));
function findCyExecOrTask(node) {
    const cyExecOrTaskCalls = [];
    if (ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        ts.isIdentifier(node.expression.expression) &&
        node.expression.expression.text === "cy") {
        const method = node.expression.name.text;
        if (method === "exec" || method === "task") {
            cyExecOrTaskCalls.push(node);
        }
    }
    return cyExecOrTaskCalls;
}
function findCyExecOrTaskRecursively(node) {
    let calls = [];
    ts.forEachChild(node, (child) => {
        calls = calls.concat(findCyExecOrTask(child));
        calls = calls.concat(findCyExecOrTaskRecursively(child));
    });
    return calls;
}
function noWebServerInCypress(node) {
    const violations = [];
    if (ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === "describe") {
        const [, callback] = node.arguments;
        if (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback)) {
            const cyExecOrTaskCalls = findCyExecOrTaskRecursively(callback.body);
            for (const cyCall of cyExecOrTaskCalls) {
                const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), cyCall.getStart()).line + 1;
                violations.push({
                    filepath: node.getSourceFile().fileName,
                    line: line,
                    description: "Do not start a web server from within Cypress scripts with cy.exec() or cy.task()",
                });
            }
        }
    }
    return violations;
}
exports.noWebServerInCypress = noWebServerInCypress;
