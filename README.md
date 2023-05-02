# cy-lint

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
npm start -- ./src/rules/rules.json /path/to/your/test/files
```
Replace `/path/to/your/test/files` with the path to your Cypress test files.


## Configuration

The rules are defined in a JSON file. The default configuration is located at `src/rules/rules.json`. You can customize the rules by creating your own configuration file and passing its path when running the linter.

## Creating new rules
To create a new rule, follow these steps:

1. Create a new TypeScript file in the src/rules directory.
2. Define and export a function that analyzes a TypeScript AST node and returns an array of violations.
3. Add an entry for the new rule in the src/rulesRegistry.ts file, mapping the rule's unique ID to the function.
4. Update the configuration file to enable or disable the new rule as needed.


## Contributing

We welcome contributions to this project. Please submit a pull request with your proposed changes, and include a description of the changes and the reason for the update.

Before submitting a pull request, make sure to test your changes thoroughly and update any relevant documentation.
