import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { Command } from "commander";
import { ruleRegistry } from "./rulesRegistry";
import { Rule } from "./types/rules";
import { Violation } from "./types/violations";
import { printCliReport } from "./reporters/cliReporters";
import { saveReportAsJson } from "./reporters/jsonReporters";

const program = new Command();

program
  .arguments("<config> [testDirectory]")
  .description("Analyze Cypress tests using the provided configuration file")
  .action((config: string, testDirectory = "./") => {
    const { violations, message } = main(config, testDirectory);
    console.log(message);

    if (violations.length > 0) {
      printCliReport(violations);
      saveReportAsJson(violations, "report.json");
    }
  });

program.parse(process.argv);

export function main(
  configPath: string,
  testDirectory: string
): { violations: Violation[]; message: string } {
  const ruleConfig: Rule[] = JSON.parse(fs.readFileSync(configPath, "utf8"));

  const RuleFunctions = ruleConfig
    .filter((rule: Rule) => rule.enabled)
    .map((rule: Rule) => ruleRegistry[rule.id]);

  const testFiles = parseTestFiles(testDirectory);

  const violations: Violation[] = testFiles.flatMap((testFile) =>
    analyzeTestFile(testFile, RuleFunctions)
  );

  const message =
    violations.length === 0 ? "No violations found" : "Found violations:";

  return { violations, message };
}

function parseTestFiles(directory: string): string[] {
  return fs
    .readdirSync(directory)
    .reduce((testFiles: string[], file: string) => {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        return testFiles.concat(parseTestFiles(filePath));
      } else if (file.endsWith(".cy.ts")) {
        return testFiles.concat(filePath);
      }

      return testFiles;
    }, []);
}

type ruleFunction = (node: ts.Node) => Violation[];

function analyzeTestFile(
  filePath: string,
  RuleFunctions: ruleFunction[]
): Violation[] {
  const sourceCode = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  const violations: Violation[] = [];

  function visit(node: ts.Node) {
    RuleFunctions.forEach((RuleFunction) => {
      violations.push(...RuleFunction(node));
    });

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return violations;
}
