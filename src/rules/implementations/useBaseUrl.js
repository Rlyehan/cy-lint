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
exports.useBaseUrl = void 0;
const ts = __importStar(require("typescript"));
function isFullUrl(url) {
    const regex = new RegExp(/^(https?:\/\/|\/\/)/);
    return regex.test(url);
}
function useBaseUrl(node) {
    const violations = [];
    if (ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        ts.isIdentifier(node.expression.expression) &&
        ts.isIdentifier(node.expression.name) &&
        node.expression.expression.text === "cy" &&
        node.expression.name.text === "visit") {
        const [urlNode] = node.arguments;
        if (ts.isStringLiteral(urlNode) && isFullUrl(urlNode.text)) {
            const line = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart())
                .line + 1;
            violations.push({
                filepath: node.getSourceFile().fileName,
                line: line,
                description: "Use base URL from config instead of full URLs",
            });
        }
    }
    return violations;
}
exports.useBaseUrl = useBaseUrl;
