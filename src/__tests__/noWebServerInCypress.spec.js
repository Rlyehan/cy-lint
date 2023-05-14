"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noWebServerInCypress_1 = require("../rules/implementations/noWebServerInCypress");
const test_utils_1 = require("../test_utils");
describe("noWebServerInCypress rule", () => {
    it("should pass when no cy.exec or cy.task is used in describe", () => {
        const code = `
      describe('Test without cy.exec or cy.task', () => {
        it('does something', () => {
          cy.get('.element').should('be.visible');
        });
      });
    `;
        const violations = [];
        (0, test_utils_1.traverseAst)(code, (node) => {
            violations.push(...(0, noWebServerInCypress_1.noWebServerInCypress)(node));
        });
        expect(violations.length).toBe(0);
    });
    it("should fail when cy.exec or cy.task is used in describe", () => {
        const code = `
      describe('Test with cy.exec or cy.task', () => {
        it('does something', () => {
          cy.exec('some command');
          cy.get('.element').should('be.visible');
        });
      });
    `;
        const violations = [];
        (0, test_utils_1.traverseAst)(code, (node) => {
            violations.push(...(0, noWebServerInCypress_1.noWebServerInCypress)(node));
        });
        expect(violations.length).toBe(1);
        expect(violations[0].description).toBe("Do not start a web server from within Cypress scripts with cy.exec() or cy.task()");
    });
});
