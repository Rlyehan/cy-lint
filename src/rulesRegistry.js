"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ruleRegistry = void 0;
const noHardCodeWait_1 = require("./rules/implementations/noHardCodeWait");
const useDataAttributes_1 = require("./rules/implementations/useDataAttributes");
const avoidTagClassId_1 = require("./rules/implementations/avoidTagClassId");
const avoidCommandReturnValueAssignments_1 = require("./rules/implementations/avoidCommandReturnValueAssignments");
const noExternalSiteVisit_1 = require("./rules/implementations/noExternalSiteVisit");
const noTestStateDependence_1 = require("./rules/implementations/noTestStateDependence");
const noWebServerInCypress_1 = require("./rules/implementations/noWebServerInCypress");
const atLeastOneAssertion_1 = require("./rules/implementations/atLeastOneAssertion");
const useBaseUrl_1 = require("./rules/implementations/useBaseUrl");
const noHardcodedCredentials_1 = require("./rules/implementations/noHardcodedCredentials");
exports.ruleRegistry = {
    "no-hardcoded-wait": noHardCodeWait_1.noHardcodedWait,
    "use-data-attributes": useDataAttributes_1.useDataAttributes,
    "avoid-tag-class-id-selectors": avoidTagClassId_1.avoidTagClassIdSelectors,
    "avoid-command-return-value-assignments": avoidCommandReturnValueAssignments_1.avoidCommandReturnValueAssignments,
    "no-external-site-visit": noExternalSiteVisit_1.noExternalSiteVisit,
    "no-test-state-dependence": noTestStateDependence_1.noTestStateDependence,
    "no-web-server-in-cypress": noWebServerInCypress_1.noWebServerInCypress,
    "at-least-one-assertion": atLeastOneAssertion_1.atLeastOneAssertion,
    "use-base-url": useBaseUrl_1.useBaseUrl,
    "no-hardcoded-credentials": noHardcodedCredentials_1.noHardcodedCredentials,
};
