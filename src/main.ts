import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { Argv } from "yargs";
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
import Table from "cli-table3";
import { ruleRegistry } from "./rulesRegistry";
import { Rule } from "./rules";

yargs(hideBin(process.argv))
.command(
  "$0 <config> [testDirectory]",
  "Analyze Cypress tests using the provided configuration file",
  (yargs: Argv) => {
    yargs
      .positional("config", {
        describe: "Path to the configuration file",
        type: "string",
        demandOption: true,
      })
      .positional("testDirectory", {
        describe: "Path to the directory containing the test files",
        type: "string",
        default: "./",
      });
  },
  (argv: { config: string; testDirectory: string }) => {
      main(argv.config as string, argv.testDirectory as string);
    }
  )
  .demandCommand(1, "You must provide a valid command")
  .help()
  .strict()
  .parse();

function main(configPath: string, testDirectory: string) {
  console.log(`Analyzing your Cypress tests using the configuration file: ${configPath}`);

  const ruleConfig: Rule[] = JSON.parse(fs.readFileSync(configPath, "utf8"));

  const RuleFunctions = ruleConfig
    .filter((rule: Rule) => rule.enabled)
    .map((rule: Rule) => ruleRegistry[rule.id]);

  const testFiles = parseTestFiles(testDirectory);

  const violations: any[] = [];

  testFiles.forEach((testFile) => {
    violations.push(...analyzeTestFile(testFile, RuleFunctions));
  });

  if (violations.length === 0) {
    console.log("No violations found");
  } else {
    console.log("Found violations:");
    
    // Create a new table instance
    const table = new Table({
        head: ["File", "Line", "Description"],
        colWidths: [30, 10, 60],
    });

    // Add the violations to the table
    violations.forEach((violation) => {
        table.push([violation.filepath, violation.line, violation.description]);
    });

    // Display the table
    console.log(table.toString());
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