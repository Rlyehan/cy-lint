import { noTestStateDependence } from '../rules/implementations/noTestStateDependence';
import { traverseAst } from '../test_utils';

describe('no-test-state-dependence rule', () => {
  it('should pass when tests do not rely on previous tests', () => {
    const code = `
      describe('my form', () => {
        beforeEach(() => {
          cy.visit('/users/new');
          cy.get('[data-testid="first-name"]').type('Johnny');
          cy.get('[data-testid="last-name"]').type('Appleseed');
        });

        it('displays form validation', () => {
          // Test code here
        });

        it('can submit a valid form', () => {
          // Test code here
        });
      });
    `;

    const violations: any[] = [];
    traverseAst(code, (node) => {
      violations.push(...noTestStateDependence(node));
    });

    expect(violations.length).toBe(0);
  });

  it('should fail when tests rely on previous tests', () => {
    const code = `
      describe('my form', () => {
        it('visits the form', () => {
          cy.visit('/users/new');
        });

        it('requires first name', () => {
          cy.get('[data-testid="first-name"]').type('Johnny');
        });

        it('requires last name', () => {
          cy.get('[data-testid="last-name"]').type('Appleseed');
        });

        it('can submit a valid form', () => {
          cy.get('form').submit();
        });
      });
    `;

    const violations: any[] = [];
    traverseAst(code, (node) => {
      violations.push(...noTestStateDependence(node));
    });

    expect(violations.length).toBe(1);
    expect(violations[0].description).toBe('Avoid having tests rely on the state of previous tests');
  });
});
