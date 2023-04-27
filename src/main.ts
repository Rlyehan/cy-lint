import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript"
import { ruleRegistry } from "./rulesRegistry";
import { Rule } from "./rules";

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Please provide a path to your config file");
} else {
    const configPath = args[0];
    console.log(`Analyzing your Cypress tests using the configuration file: ${configPath}`);

    const ruleConfig: Rule[] = JSON.parse(fs.readFileSync(configPath, "utf8"));

    const RuleFunctions = ruleConfig
        .filter((rule: Rule) => rule.enabled)
        .map((rule: Rule) => ruleRegistry[rule.id]);

    console.log('Enabled rules:', RuleFunctions);

    const testDirectory = args[1];
    const testFiles = parseTestFiles(testDirectory);

    console.log('Test files to analyze:', testFiles);

    const violations: any[] = [];

    testFiles.forEach((testFile) => {
        console.log(`Analyzing test file: ${testFile}`);
        violations.push(...analyzeTestFile(testFile, RuleFunctions));
    });

    if (violations.length === 0) {
        console.log("No violations found");
    } else {
        console.log("Found violations:");
        violations.forEach((violation) => {
            console.log(violation);
        });
        const reportPath = "violations_report.txt";
        generateReport(violations, reportPath);
        console.log(`Report saved to ${reportPath}`);
    }
}

function parseTestFiles(directory: string): string[] {
    const files = fs.readdirSync(directory);
    const testFiles: string[] = [];

    files.forEach((file) => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            testFiles.push(...parseTestFiles(filePath));
        } else if (file.endsWith(".cy.ts")) {
            testFiles.push(filePath);
        }
    });

    return testFiles;
}

function analyzeTestFile(filePath: string, RuleFunctions: any[]): any[] {
    const sourceCode = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true);

    const violations: any[] = [];

    function visit(node: ts.Node) {
        RuleFunctions.forEach((RuleFunction) => {
            violations.push(...RuleFunction(node));
        });

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    return violations;
}

function generateReport(violations: any[], outputPath: string): void {
    const reportLines: string[] = [];
  
    violations.forEach((violation) => {
      reportLines.push(
        `${violation.filepath}:${violation.line} - ${violation.description}`
      );
    });
  
    const reportContent = reportLines.join("\n");
  
    fs.writeFileSync(outputPath, reportContent);
  }