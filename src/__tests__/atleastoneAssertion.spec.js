"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atLeastOneAssertion_1 = require("../rules/implementations/atLeastOneAssertion");
const test_utils_1 = require("../test_utils");
describe("atLeastOneAssertionPerItBlock rule", () => {
  it("should pass when there is at least one assertion in each it block", () => {
    const code = `
    describe('my form', () => {
        it('displays form validation', () => {
          cy.get('.error').should('be.visible');
        });

        it('can submit a valid form', () => {
          expect(true).toBe(true);
        });
      });
    `;
    const violations = [];
    (0, test_utils_1.traverseAst)(code, (node) => {
      violations.push(...(0, atLeastOneAssertion_1.atLeastOneAssertion)(node));
    });
    expect(violations.length).toBe(0);
  });
  it("should fail when there is no assertion in an it block", () => {
    const code = `
    describe('my form', () => {
        it('displays form validation', () => {
          cy.get('.error').should('be.visible');
        });

        it('can submit a valid form', () => {
          // Missing assertion
        });
      });
    `;
    const violations = [];
    (0, test_utils_1.traverseAst)(code, (node) => {
      violations.push(...(0, atLeastOneAssertion_1.atLeastOneAssertion)(node));
    });
    expect(violations.length).toBe(1);
    expect(violations[0].description).toBe(
      "There should be at least one assertion in each it block"
    );
  });
});
