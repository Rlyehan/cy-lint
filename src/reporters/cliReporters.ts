import Table from "cli-table3";
import { Violation } from "../types/violations";

export function printCliReport(violations: Violation[]): void {
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
