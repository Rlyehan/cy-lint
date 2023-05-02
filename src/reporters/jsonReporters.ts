import * as fs from "fs";
import { Violation } from "../types/violations";

export function saveReportAsJson(violations: Violation[], outputPath: string): void {
  const reportData = {
    timestamp: new Date().toISOString(),
    violations: violations,
  };

  fs.writeFileSync(outputPath, JSON.stringify(reportData, null, 2));

  console.log(`Report saved as JSON: ${outputPath}`);
}
