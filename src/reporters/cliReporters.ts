import Table from "cli-table3";
import { Violation } from "../types/violations";

export function printCliReport(violations: Violation[]): void {
  const table = new Table({
    head: ["File", "Line", "Description"],
    colWidths: [30, 10, 60],
  });

  violations.forEach((violation) => {
    table.push([violation.filepath, violation.line, violation.description]);
  });

  console.log(table.toString());
}
