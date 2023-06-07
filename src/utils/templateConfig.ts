export const templateConfig = {
    "testDirectory": "./sample_tests",
    "rules": [
      {
        "id": "no-hardcoded-wait",
        "description": "Disallow the use of hardcoded wait times.",
        "enabled": true
      },
      {
        "id": "use-data-attributes",
        "description": "Use data-* attributes for selectors.",
        "enabled": true
      },
      {
        "id": "avoid-tag-class-id-selectors",
        "description": "Avoid using tag, class, or ID selectors.",
        "enabled": true
      },
      {
        "id": "avoid-command-return-value-assignments",
        "description": "Avoid assigning the return value of Cypress commands with const, let, or var.",
        "enabled": true
      },
      {
        "id": "no-external-site-visit",
        "description": "Avoid visiting external sites or servers you do not control.",
        "enabled": true
      },
      {
        "id": "no-test-state-dependence",
        "description": "Avoid having tests rely on the state of previous tests.",
        "enabled": true
      },
      {
        "id": "no-web-server-in-cypress",
        "description": "Avoid starting a web server from within Cypress scripts with cy.exec() or cy.task().",
        "enabled": true
      },
      {
        "id": "at-least-one-assertion",
        "description": "There should be at least one assertion in each it block.",
        "enabled": true
      },
      {
        "id": "use-base-url",
        "description": "Use base URL from config instead of full URLs.",
        "enabled": true
      },
      {
        "id": "no-hardcoded-credentials",
        "description": "Avoid using hardcoded credentials in tests, use environment variables or fixtures instead.",
        "enabled": true
      }
    ]
}