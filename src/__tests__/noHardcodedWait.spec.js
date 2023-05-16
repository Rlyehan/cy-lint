"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noHardCodeWait_1 = require("../rules/implementations/noHardCodeWait");
const test_utils_1 = require("../test_utils");
describe("noHardcodedWait rule", () => {
  it("should pass when no hardcoded wait is used", () => {
    const code = `
      describe('Test without hardcoded wait', () => {
        it('does something', () => {
          cy.get('.element').should('be.visible');
        });
      });
    `;
    const violations = [];
    (0, test_utils_1.traverseAst)(code, (node) => {
      violations.push(...(0, noHardCodeWait_1.noHardcodedWait)(node));
    });
    expect(violations.length).toBe(0);
  });
  it("should fail when a hardcoded wait is used", () => {
    const code = `
      describe('Test with hardcoded wait', () => {
        it('does something', () => {
          cy.wait(500);
        });
      });
    `;
    const violations = [];
    (0, test_utils_1.traverseAst)(code, (node) => {
      violations.push(...(0, noHardCodeWait_1.noHardcodedWait)(node));
    });
    expect(violations.length).toBe(1);
    expect(violations[0].description).toBe("Avoid using hardcoded wait times");
  });
});
