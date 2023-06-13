#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { templateConfig } from "./utils/templateConfig";

const DEFAULT_CONFIG_FILE_NAME = ".cylintrc.json";
const TEST_FILE_EXTENSION = ".cy.ts";

const program = new Command();

program
  .description("Analyze Cypress tests using the provided configuration file")
  .action(() => {
    try {
      const configPath = findConfigFile(
        process.cwd(),
        DEFAULT_CONFIG_FILE_NAME
      );

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
    } catch (error: any) {
      console.error(`An error occurred: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command("init [path]")
  .description("Create a configuration file.")
  .action((path = process.cwd()) => {
    const configPath = `${path}/${DEFAULT_CONFIG_FILE_NAME}`;
    if (fs.existsSync(configPath)) {
      console.error("config file already exists.");
      process.exit(1);
    }

    try {
      fs.writeFileSync(
        configPath,
        JSON.stringify(templateConfig, null, 2),
        "utf8"
      );
      console.log("Created a sample config file at.");
    } catch (error: any) {
      console.error("Failed to create config file: ${error.message}");
      process.exit(1);
    }
  });

program.parse(process.argv);

export function main(configPath: string): {
  violations: Violation[];
  message: string;
} {
  let config: Config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (error: any) {
    throw new Error(`Failed to parse config file: ${error.message}`);
  }

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
      } else if (file.endsWith(TEST_FILE_EXTENSION)) {
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
  let sourceCode;
  try {
    sourceCode = fs.readFileSync(filePath, "utf8");
  } catch (error: any) {
    throw new Error(`Failed to read test file: ${error.message}`);
  }

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
