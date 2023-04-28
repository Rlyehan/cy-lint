describe('Violations of all rules', () => {
    it('State dependence violation', () => {
      cy.visit('/users/new');
      cy.get('[data-testid="first-name"]').type('Johnny');
  
      cy.get('[data-testid="last-name"]').type('Appleseed');
      cy.get('form').submit();
    });
  
    it('No assertion violation', () => {
      cy.visit('/users');
      // No assertions here
    });
  
    describe('Base URL violation', () => {
      it('does something', () => {
        cy.visit('https://example.com/users');
      });
    });
  
    describe('Hardcoded credentials violation', () => {
      beforeEach(() => {
        cy.visit('/login');
        cy.get('#username').type('test_user');
        cy.get('#password').type('test_password');
      });
  
      it('does something with hardcoded credentials', () => {
        // Test code here
      });
    });
  });
  