import { Node } from "typescript";
import { noHardcodedWait } from "./rules/implementations/noHardCodeWait";
import { useDataAttributes } from "./rules/implementations/useDataAttributes";

type RuleFunction = (node: Node, config: any) => any[];

export const ruleRegistry: Record<string, RuleFunction> = {
  "no-hardcoded-wait": noHardcodedWait,
  "use-data-attributes": useDataAttributes,
};