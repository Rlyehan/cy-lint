import { noHardcodedCredentials } from '../rules/implementations/noHardcodedCredentials';
import { traverseAst } from '../test_utils';

describe('noHardcodedCredentials rule', () => {
  it('should pass when no hardcoded credentials are present', () => {
    const code = `
      describe('login', () => {
        beforeEach(() => {
          cy.visit('/login');
        });

        it('logs in successfully', () => {
          cy.get('#username').type(Cypress.env('USERNAME'));
          cy.get('#password').type(Cypress.env('PASSWORD'));
          cy.get('#login').click();
        });
      });
    `;

    const violations: any[] = [];
    traverseAst(code, (node) => {
      violations.push(...noHardcodedCredentials(node));
    });

    expect(violations.length).toBe(0);
  });

  it('should fail when hardcoded credentials are present', () => {
    const code = `
      describe('login', () => {
        beforeEach(() => {
          cy.visit('/login');
        });

        it('logs in successfully', () => {
          cy.get('#username').type('admin');
          cy.get('#password').type('password123');
          cy.get('#login').click();
        });
      });
    `;

    const violations: any[] = [];
    traverseAst(code, (node) => {
      violations.push(...noHardcodedCredentials(node));
    });

    expect(violations.length).toBe(2);
    expect(violations[0].description).toBe('Avoid using hardcoded credentials in tests, use environment variables or fixtures instead');
    expect(violations[1].description).toBe('Avoid using hardcoded credentials in tests, use environment variables or fixtures instead');
  });
});
