## Table of Contents

- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Linting](#linting)
- [Guidelines](#guidelines)

## Commands

Running locally:

```bash
yarn dev
```

Making production build:

```bash
yarn build

```

Running in production:

```bash
yarn serve

```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

Linting:

```bash

# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix

```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash

# Port number
PORT=5000

# URL of the Servver
SERVER_URL=http://localhost:5000/

# # EXAMPLE
# # EXAMPLE secret key
# EXAMPLE_SECRET=thisisasamplesecret
# # Number of minutes after which an access token expires
# EXAMPLE_ACCESS_EXPIRATION_MINUTES=30000
# # Number of days after which a refresh token expires
# EXAMPLE_REFRESH_EXPIRATION_DAYS=30

```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--components\     # All Components
 |--screens\        # Main Screens
 |--layouts\        # Common layouts
 |--routes\         # Routes
 |--hooks\          # Custom Hooks
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # React app
 |--index        # App entry point

```

## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this app, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`

---

## Guidelines

### Git commit messages

- Limit the subject line to 72 characters
- Capitalize the first letter of the subject line
- Use the present tense ("Add feature" instead of "Added feature")
- Separate the subject from the body with a blank line
- Reference issues and pull requests in the body

### Coding style guide

We are using ESLint to ensure a consistent code style in the project, based on [Airbnb's JS style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base).

Some other ESLint plugins are also being used, such as the [Prettier](https://github.com/prettier/eslint-plugin-prettier) and [Jest](https://github.com/jest-community/eslint-plugin-jest) plugins.

Please make sure that the code you are pushing conforms to the style guides mentioned above

### Before any commit, eslint will kick off and let you know about issues in the code. Fix the code according to the given conventions, so that the repository never has 💩 code.

_Note: The code will also auto-format on commit success_

### Best Emogy for Commits

| Emogy | Description                                                   |
| ----- | ------------------------------------------------------------- |
| 🚨    | Alert                                                         |
| 🐳    | Docker concerned things                                       |
| ⚡️   | Installation                                                  |
| 🎨    | Improve structure / format of the code                        |
| 🔥    | Remove code or files                                          |
| ✨    | Introduce new features.                                       |
| 📝    | Add or update documentation.                                  |
| 🚀    | Deploy stuff.                                                 |
| ♻️    | Refactor code.                                                |
| ➕    | Add a dependency.                                             |
| ➖    | Remove a dependency.                                          |
| 🚩    | Add, update, or remove feature flags.                         |
| 🥅    | Catch errors. a                                               |
| 💫    | Add or update animations and transitions.                     |
| 🗑     | Deprecate code that needs to be cleaned up.                   |
| 🛂    | Work on code related to authorization, roles and permissions. |
| 🩹    | Simple fix for a non-critical issue.                          |
| 🗃     | Perform database related changes.                             |
| 🚚    | Move or rename resources (e.g.: files, paths, routes          |
