import { Node } from "typescript";
import { noHardcodedWait } from "./rules/implementations/noHardCodeWait";
import { useDataAttributes } from "./rules/implementations/useDataAttributes";
import { avoidTagClassIdSelectors } from "./rules/implementations/avoidTagClassId";
import { avoidCommandReturnValueAssignments } from "./rules/implementations/avoidCommandReturnValueAssignments";
import { noExternalSiteVisit } from "./rules/implementations/noExternalSiteVisit";
import { noTestStateDependence } from "./rules/implementations/noTestStateDependence";
import { noWebServerInCypress } from "./rules/implementations/noWebServerInCypress";
import { atLeastOneAssertion } from "./rules/implementations/atLeastOneAssertion";
import { useBaseUrl } from "./rules/implementations/useBaseUrl";
import { noHardcodedCredentials } from "./rules/implementations/noHardcodedCredentials";
import { Violation } from "./types/violations";

type RuleFunction = (node: Node) => Violation[];

export const ruleRegistry: Record<string, RuleFunction> = {
  "no-hardcoded-wait": noHardcodedWait,
  "use-data-attributes": useDataAttributes,
  "avoid-tag-class-id-selectors": avoidTagClassIdSelectors,
  "avoid-command-return-value-assignments": avoidCommandReturnValueAssignments,
  "no-external-site-visit": noExternalSiteVisit,
  "no-test-state-dependence": noTestStateDependence,
  "no-web-server-in-cypress": noWebServerInCypress,
  "at-least-one-assertion": atLeastOneAssertion,
  "use-base-url": useBaseUrl,
  "no-hardcoded-credentials": noHardcodedCredentials,
};
