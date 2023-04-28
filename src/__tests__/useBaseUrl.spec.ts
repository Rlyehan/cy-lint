import { useBaseUrl } from '../rules/implementations/useBaseUrl';
import { traverseAst } from '../test_utils';

describe('useBaseUrl rule', () => {
  it('should pass when using relative URLs with cy.visit', () => {
    const code = `
      describe('my form', () => {
        it('visits the form', () => {
          cy.visit('/users/new');
        });
      });
    `;

    const violations: any[] = [];
    traverseAst(code, (node) => {
      violations.push(...useBaseUrl(node, {}));
    });

    expect(violations.length).toBe(0);
  });

  it('should fail when using full URLs with cy.visit', () => {
    const code = `
      describe('my form', () => {
        it('visits the form', () => {
          cy.visit('https://example.com/users/new');
        });
      });
    `;

    const violations: any[] = [];
    traverseAst(code, (node) => {
      violations.push(...useBaseUrl(node, {}));
    });

    expect(violations.length).toBe(1);
    expect(violations[0].description).toBe('Use base URL from config instead of full URLs');
  });
});
