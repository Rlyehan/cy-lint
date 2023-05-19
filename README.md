# cy-lint

[![CI](https://github.com/Rlyehan/cy-lint/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/Rlyehan/cy-lint/actions/workflows/main.yml)

Cy-Lint is a Cypress linting tool that helps ensure your test files adhere to best practices. It analyzes your Cypress tests based on a set of rules defined in a configuration file and generates a report of any violations found.

## Getting Started

1. Clone this repository:

```
git clone https://github.com/yourusername/cy-lint.git
```

2. Install the dependencies:

```
cd cy-lint
npm install
```

3. Run the linter on your test files:

```
npm start 
```

## Configuration

The rules are defined in a .cylintrc.json configuration file. This file should be located at the root of your project or any subdirectory.
In there you can select wich rules should be active and also define teh path to your test scripts.

## Creating new rules

To create a new rule, follow these steps:

1. Create a new TypeScript file in the src/rules directory.
2. Define and export a function that analyzes a TypeScript AST node and returns an array of violations.
3. Add an entry for the new rule in the src/rulesRegistry.ts file, mapping the rule's unique ID to the function.
4. Update the configuration file to enable or disable the new rule as needed.

## Contributing

We welcome contributions to this project. Please submit a pull request with your proposed changes, and include a description of the changes and the reason for the update.

Before submitting a pull request, make sure to test your changes thoroughly and update any relevant documentation.
