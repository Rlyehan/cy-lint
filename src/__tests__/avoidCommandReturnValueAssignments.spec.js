"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const avoidCommandReturnValueAssignments_1 = require("../rules/implementations/avoidCommandReturnValueAssignments");
const test_utils_1 = require("../test_utils");
describe("avoidCommandReturnValueAssignments rule", () => {
    it("should pass when no command return value assignments are present", () => {
        const code = `
      describe('Test without command return value assignments', () => {
        it('does something', () => {
          cy.visit('/users');
          cy.get('#username').type('test_user');
        });
      });
    `;
        const violations = [];
        (0, test_utils_1.traverseAst)(code, (node) => {
            violations.push(...(0, avoidCommandReturnValueAssignments_1.avoidCommandReturnValueAssignments)(node));
        });
        expect(violations.length).toBe(0);
    });
    it("should fail when command return value assignments are present", () => {
        const code = `
      describe('Test with command return value assignments', () => {
        it('does something', () => {
          const element = cy.get('#username');
          element.type('test_user');
        });
      });
    `;
        const violations = [];
        (0, test_utils_1.traverseAst)(code, (node) => {
            violations.push(...(0, avoidCommandReturnValueAssignments_1.avoidCommandReturnValueAssignments)(node));
        });
        expect(violations.length).toBe(1);
        expect(violations[0].description).toBe("Avoid assigning the return value of Cypress commands with const, let, or var");
    });
});
