import { Rule } from "./rules"
export interface Config {
    testDirectory: string;
    rules: Rule[];
}