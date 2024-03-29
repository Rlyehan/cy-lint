import { useDataAttributes } from "../rules/implementations/useDataAttributes";
import { traverseAst } from "../test_utils";
import { Violation } from "../types/violations";

describe("useDataAttributes rule", () => {
  it("should pass when data-* attributes are used", () => {
    const code = `
      describe("Data attribute test", () => {
        it("should find elements using data-* attributes", () => {
          cy.get("[data-testid='element']");
        });
      });
    `;

    const violations: Violation[] = [];
    traverseAst(code, (node) => {
      violations.push(...useDataAttributes(node));
    });

    expect(violations.length).toBe(0);
  });

  it("should fail when non-data-* attributes are used", () => {
    const code = `
      describe("Non-data attribute test", () => {
        it("should find elements using non-data-* attributes", () => {
          cy.get(".element");
        });
      });
    `;

    const violations: Violation[] = [];
    traverseAst(code, (node) => {
      violations.push(...useDataAttributes(node));
    });

    expect(violations.length).toBe(1);
    expect(violations[0].description).toBe(
      "Use data-* attributes for selecting elements."
    );
  });
});
