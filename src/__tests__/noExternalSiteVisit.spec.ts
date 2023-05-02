import { noExternalSiteVisit } from "../rules/implementations/noExternalSiteVisit";
import { traverseAst } from "../test_utils";
import { Violation } from "../types/violations";

describe("noExternalSiteVisit rule", () => {
  it("should pass when no external site visit is used", () => {
    const code = `
      describe('Test without external site visit', () => {
        it('does something', () => {
          cy.visit('/local-path');
        });
      });
    `;

    const violations: Violation[] = [];
    traverseAst(code, (node) => {
      violations.push(...noExternalSiteVisit(node));
    });

    expect(violations.length).toBe(0);
  });

  it("should fail when an external site visit is used", () => {
    const code = `
      describe('Test with external site visit', () => {
        it('does something', () => {
          cy.visit('https://example.com');
        });
      });
    `;

    const violations: Violation[] = [];
    traverseAst(code, (node) => {
      violations.push(...noExternalSiteVisit(node));
    });

    expect(violations.length).toBe(1);
    expect(violations[0].description).toBe(
      "Avoid visiting external sites or servers you do not control"
    );
  });
});
