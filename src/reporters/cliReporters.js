"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printCliReport = void 0;
const cli_table3_1 = __importDefault(require("cli-table3"));
function printCliReport(violations) {
    const table = new cli_table3_1.default({
        head: ["File", "Line", "Description"],
        colWidths: [30, 10, 60],
    });
    violations.forEach((violation) => {
        table.push([violation.filepath, violation.line, violation.description]);
    });
    console.log(table.toString());
}
exports.printCliReport = printCliReport;
