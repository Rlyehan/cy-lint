// sample_tests/example.spec.ts

describe("Sample test suite", () => {
  it("Sample test case", () => {
    cy.visit("/");
    cy.wait(1000); // This line should trigger a violation for the "no-hardcoded-wait" rule
    cy.get("#element"); // This line should trigger a violation for the "use-data-attributes" rule
  });
});
