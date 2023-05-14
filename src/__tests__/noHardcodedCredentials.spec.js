"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noHardcodedCredentials_1 = require("../rules/implementations/noHardcodedCredentials");
const test_utils_1 = require("../test_utils");
describe("noHardcodedCredentials rule", () => {
    it("should pass when no hardcoded credentials are present", () => {
        const code = `
      describe('login', () => {
        beforeEach(() => {
          cy.visit('/login');
        });

        it('logs in successfully', () => {
          cy.get('#username').type(Cypress.env('USERNAME'));
          cy.get('#password').type(Cypress.env('PASSWORD'));
          cy.get('#login').click();
        });
      });
    `;
        const violations = [];
        (0, test_utils_1.traverseAst)(code, (node) => {
            violations.push(...(0, noHardcodedCredentials_1.noHardcodedCredentials)(node));
        });
        expect(violations.length).toBe(0);
    });
    it("should fail when hardcoded credentials are present", () => {
        const code = `
      describe('login', () => {
        beforeEach(() => {
          cy.visit('/login');
        });

        it('logs in successfully', () => {
          cy.get('#username').type('admin');
          cy.get('#password').type('password123');
          cy.get('#login').click();
        });
      });
    `;
        const violations = [];
        (0, test_utils_1.traverseAst)(code, (node) => {
            violations.push(...(0, noHardcodedCredentials_1.noHardcodedCredentials)(node));
        });
        expect(violations.length).toBe(2);
        expect(violations[0].description).toBe("Avoid using hardcoded credentials in tests, use environment variables or fixtures instead");
        expect(violations[1].description).toBe("Avoid using hardcoded credentials in tests, use environment variables or fixtures instead");
    });
});
