import { noWebServerInCypress } from "../rules/implementations/noWebServerInCypress";
import { traverseAst } from "../test_utils";
import { Violation } from "../types/violations";

describe("noWebServerInCypress rule", () => {
  it("should pass when no cy.exec or cy.task is used in describe", () => {
    const code = `
      describe('Test without cy.exec or cy.task', () => {
        it('does something', () => {
          cy.get('.element').should('be.visible');
        });
      });
    `;

    const violations: Violation[] = [];
    traverseAst(code, (node) => {
      violations.push(...noWebServerInCypress(node));
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

    const violations: Violation[] = [];
    traverseAst(code, (node) => {
      violations.push(...noWebServerInCypress(node));
    });

    expect(violations.length).toBe(1);
    expect(violations[0].description).toBe(
      "Do not start a web server from within Cypress scripts with cy.exec() or cy.task()"
    );
  });
});
