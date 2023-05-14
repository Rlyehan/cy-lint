"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noExternalSiteVisit_1 = require("../rules/implementations/noExternalSiteVisit");
const test_utils_1 = require("../test_utils");
describe("noExternalSiteVisit rule", () => {
    it("should pass when no external site visit is used", () => {
        const code = `
      describe('Test without external site visit', () => {
        it('does something', () => {
          cy.visit('/local-path');
        });
      });
    `;
        const violations = [];
        (0, test_utils_1.traverseAst)(code, (node) => {
            violations.push(...(0, noExternalSiteVisit_1.noExternalSiteVisit)(node));
        });
        expect(violations.length).toBe(0);
    });
    it("should fail when an external site visit is used", () => {
        const code = `
      describe('Test with external site visit', () => {
        it('does something', () => {
          cy.visit('https://example.com');
        });
      });
    `;
        const violations = [];
        (0, test_utils_1.traverseAst)(code, (node) => {
            violations.push(...(0, noExternalSiteVisit_1.noExternalSiteVisit)(node));
        });
        expect(violations.length).toBe(1);
        expect(violations[0].description).toBe("Avoid visiting external sites or servers you do not control");
    });
});
