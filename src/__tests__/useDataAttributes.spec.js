"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const useDataAttributes_1 = require("../rules/implementations/useDataAttributes");
const test_utils_1 = require("../test_utils");
describe("useDataAttributes rule", () => {
    it("should pass when data-* attributes are used", () => {
        const code = `
      describe("Data attribute test", () => {
        it("should find elements using data-* attributes", () => {
          cy.get("[data-testid='element']");
        });
      });
    `;
        const violations = [];
        (0, test_utils_1.traverseAst)(code, (node) => {
            violations.push(...(0, useDataAttributes_1.useDataAttributes)(node));
        });
        expect(violations.length).toBe(0);
    });
    it("should fail when non-data-* attributes are used", () => {
        const code = `
      describe("Non-data attribute test", () => {
        it("should find elements using non-data-* attributes", () => {
          cy.get(".element");
        });
      });
    `;
        const violations = [];
        (0, test_utils_1.traverseAst)(code, (node) => {
            violations.push(...(0, useDataAttributes_1.useDataAttributes)(node));
        });
        expect(violations.length).toBe(1);
        expect(violations[0].description).toBe("Use data-* attributes for selecting elements.");
    });
});
