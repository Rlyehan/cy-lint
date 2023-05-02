import { noHardcodedWait } from "../rules/implementations/noHardCodeWait";
import { traverseAst } from "../test_utils";
import { Violation } from "../types/violations";

describe("noHardcodedWait rule", () => {
  it("should pass when no hardcoded wait is used", () => {
    const code = `
      describe('Test without hardcoded wait', () => {
        it('does something', () => {
          cy.get('.element').should('be.visible');
        });
      });
    `;

    const violations: Violation[] = [];
    traverseAst(code, (node) => {
      violations.push(...noHardcodedWait(node));
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

    const violations: Violation[] = [];
    traverseAst(code, (node) => {
      violations.push(...noHardcodedWait(node));
    });

    expect(violations.length).toBe(1);
    expect(violations[0].description).toBe("Avoid using hardcoded wait times");
  });
});
