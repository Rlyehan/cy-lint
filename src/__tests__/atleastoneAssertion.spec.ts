import { atLeastOneAssertion } from "../rules/implementations/atLeastOneAssertion";
import { traverseAst } from "../test_utils";
import { Violation } from "../types/violations";

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

    const violations: Violation[] = [];
    traverseAst(code, (node) => {
      violations.push(...atLeastOneAssertion(node));
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

    const violations: Violation[] = [];
    traverseAst(code, (node) => {
      violations.push(...atLeastOneAssertion(node));
    });

    expect(violations.length).toBe(1);
    expect(violations[0].description).toBe(
      "There should be at least one assertion in each it block"
    );
  });
});
