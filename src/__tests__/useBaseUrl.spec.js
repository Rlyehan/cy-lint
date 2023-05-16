"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const useBaseUrl_1 = require("../rules/implementations/useBaseUrl");
const test_utils_1 = require("../test_utils");
describe("useBaseUrl rule", () => {
  it("should pass when using relative URLs with cy.visit", () => {
    const code = `
      describe('my form', () => {
        it('visits the form', () => {
          cy.visit('/users/new');
        });
      });
    `;
    const violations = [];
    (0, test_utils_1.traverseAst)(code, (node) => {
      violations.push(...(0, useBaseUrl_1.useBaseUrl)(node));
    });
    expect(violations.length).toBe(0);
  });
  it("should fail when using full URLs with cy.visit", () => {
    const code = `
      describe('my form', () => {
        it('visits the form', () => {
          cy.visit('https://example.com/users/new');
        });
      });
    `;
    const violations = [];
    (0, test_utils_1.traverseAst)(code, (node) => {
      violations.push(...(0, useBaseUrl_1.useBaseUrl)(node));
    });
    expect(violations.length).toBe(1);
    expect(violations[0].description).toBe(
      "Use base URL from config instead of full URLs"
    );
  });
});
