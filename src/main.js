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
exports.main = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ts = __importStar(require("typescript"));
const commander_1 = require("commander");
const rulesRegistry_1 = require("./rulesRegistry");
const cliReporters_1 = require("./reporters/cliReporters");
const jsonReporters_1 = require("./reporters/jsonReporters");
const DEFAULT_CONFIG_FILE_NAME = '.cylintrc.json';
const program = new commander_1.Command();
program
    .description('Analyze Cypress tests using the provided configuration file')
    .action(() => {
    const configPath = findConfigFile(process.cwd(), DEFAULT_CONFIG_FILE_NAME);
    if (!configPath) {
        console.error('Configuration file not found.');
        process.exit(1);
    }
    const { violations, message } = main(configPath);
    console.log(message);
    if (violations.length > 0) {
        (0, cliReporters_1.printCliReport)(violations);
        (0, jsonReporters_1.saveReportAsJson)(violations, 'report.json');
    }
});
program.parse(process.argv);
function main(configPath) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const RuleFunctions = config.rules
        .filter((rule) => rule.enabled)
        .map((rule) => rulesRegistry_1.ruleRegistry[rule.id]);
    const testFiles = parseTestFiles(config.testDirectory);
    const violations = testFiles.flatMap((testFile) => analyzeTestFile(testFile, RuleFunctions));
    const message = violations.length === 0 ? "No violations found" : "Found violations:";
    return { violations, message };
}
exports.main = main;
function parseTestFiles(directory) {
    return fs
        .readdirSync(directory)
        .reduce((testFiles, file) => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            return testFiles.concat(parseTestFiles(filePath));
        }
        else if (file.endsWith(".cy.ts")) {
            return testFiles.concat(filePath);
        }
        return testFiles;
    }, []);
}
function analyzeTestFile(filePath, RuleFunctions) {
    const sourceCode = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true);
    const violations = [];
    function visit(node) {
        RuleFunctions.forEach((RuleFunction) => {
            violations.push(...RuleFunction(node));
        });
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    return violations;
}
function findConfigFile(startPath, configFile) {
    let currentPath = startPath;
    while (true) {
        const filePath = path.join(currentPath, configFile);
        console.log(`Looking for config file in: ${currentPath}`); // Add this line
        if (fs.existsSync(filePath)) {
            return filePath;
        }
        const parentPath = path.dirname(currentPath);
        if (parentPath === currentPath) {
            break;
        }
        currentPath = parentPath;
    }
    return null;
}
