import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { Command } from "commander";
import { ruleRegistry } from "./rulesRegistry";
import { Rule } from "./types/rules";
import { Violation } from "./types/violations";
import { printCliReport } from "./reporters/cliReporters";
import { saveReportAsJson } from "./reporters/jsonReporters";
import { Config } from "./types/config";

const DEFAULT_CONFIG_FILE_NAME = ".cylintrc.json";

const program = new Command();

program
  .description("Analyze Cypress tests using the provided configuration file")
  .action(() => {
    const configPath = findConfigFile(process.cwd(), DEFAULT_CONFIG_FILE_NAME);

    if (!configPath) {
      console.error("Configuration file not found.");
      process.exit(1);
    }

    const { violations, message } = main(configPath);
    console.log(message);

    if (violations.length > 0) {
      printCliReport(violations);
      saveReportAsJson(violations, "report.json");
    }
  });

program.parse(process.argv);

export function main(configPath: string): {
  violations: Violation[];
  message: string;
} {
  const config: Config = JSON.parse(fs.readFileSync(configPath, "utf8"));

  const RuleFunctions = config.rules
    .filter((rule: Rule) => rule.enabled)
    .map((rule: Rule) => ruleRegistry[rule.id]);

  const testFiles = parseTestFiles(config.testDirectory);

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

function findConfigFile(startPath: string, configFile: string): string | null {
  let currentPath = startPath;
  let parentPath = path.dirname(currentPath);

  while (currentPath !== parentPath) {
    const filePath = path.join(currentPath, configFile);

    console.log(`Looking for config file in: ${currentPath}`);

    if (fs.existsSync(filePath)) {
      return filePath;
    }

    currentPath = parentPath;
    parentPath = path.dirname(currentPath);
  }

  const filePath = path.join(currentPath, configFile);
  if (fs.existsSync(filePath)) {
    return filePath;
  }

  return null;
}
