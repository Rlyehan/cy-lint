import { avoidTagClassIdSelectors } from "../rules/implementations/avoidTagClassId";
import { traverseAst } from "../test_utils";
import { Violation } from "../types/violations";

describe("avoidTagClassIdSelectors rule", () => {
  it("should pass when no tag, class, or ID selectors are used", () => {
    const code = `
      describe('Test without tag, class, or ID selectors', () => {
        it('does something', () => {
          cy.get('[data-testid="submit-button"]').click();
        });
      });
    `;

    const violations: Violation[] = [];
    traverseAst(code, (node) => {
      violations.push(...avoidTagClassIdSelectors(node));
    });

    expect(violations.length).toBe(0);
  });

  it("should fail when tag, class, or ID selectors are used", () => {
    const code = `
      describe('Test with tag, class, or ID selectors', () => {
        it('does something', () => {
          cy.get('#submit-button').click();
          cy.get('.submit-button').click();
          cy.get('button').click();
        });
      });
    `;

    const violations: Violation[] = [];
    traverseAst(code, (node) => {
      violations.push(...avoidTagClassIdSelectors(node));
    });

    expect(violations.length).toBe(3);
    expect(violations[0].description).toBe(
      "Avoid using tag, class, or ID selectors. Found: '#submit-button'"
    );
    expect(violations[1].description).toBe(
      "Avoid using tag, class, or ID selectors. Found: '.submit-button'"
    );
    expect(violations[2].description).toBe(
      "Avoid using tag, class, or ID selectors. Found: 'button'"
    );
  });
});
