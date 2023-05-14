"use strict";
// sample_tests/example.spec.ts
describe("Sample test suite", () => {
    it("Sample test case", () => {
        cy.visit("/");
        cy.wait(1000);
        cy.get("#element");
    });
});
