# Contributing to Radius Toolkit

Thank you for your interest in contributing to the Radius Toolkit! We welcome contributions of all kinds, and we appreciate your time and effort in helping improve this project. This guide will help you get started.

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Code Style and Guidelines](#code-style-and-guidelines)
- [Branching and Workflow](#branching-and-workflow)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Code of Conduct](#code-of-conduct)
- [Contact Information](#contact-information)

## Project Overview

The primary purpose of Radius Toolkit is to empower the development of design systems by providing tools to frame, validate, and automate tasks involved in managing design tokens. The toolkit includes TypeScript types and functions for describing, validating, and converting design tokens to different formats. It can be used as both a library and a command-line tool.

Project structure:

```
/docs                    -- Documentation generated with Typedoc
/tsconfig.cli.json       -- TypeScript configuration for the CLI target
/vite.config.cli.ts      -- Vite configuration for the CLI target
/vite.config.ts          -- Vite configuration for the library target
/tsconfig.json           -- TypeScript configuration for the library target
/src/                    -- Source code
/src/cli                 -- CLI specific source-code
/src/templates           -- Output templates for the artifact-generation feature
```

## Getting Started

### Prerequisites

- Node.js (version 20.x or higher)
- pnpm (version 8.5.x)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/radius-toolkit.git
   cd radius-toolkit
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Build the project:**

   ```bash
   pnpm run build
   ```

4. **Generate documentation:**
   ```bash
   pnpm run docs
   ```

## Code Style and Guidelines

- Follow the coding standards and style guidelines used in the project.
- Use TypeScript for type safety.
- Ensure your code is linted and formatted according to the project's settings.
- prefer types to interfaces
- prefer `const` to `let`
- prefer map, filter, reduce to for loops
- prefer arrow functions to function expressions
- avoid mutations (no array.push, object[key] = value, etc.)

## Branching and Workflow

- Use `main` for the stable version of the project.
- Create feature branches from `main` for new features or bug fixes.
- Use descriptive branch names (e.g., `feature/add-validation-rule`, `fix/issue-123`).

## Commit Messages

- Use conventional commits for commit messages.
- Format: `<type>(<scope>): <subject>`
- Types include `feat`, `fix`, `docs`, `style`, `refactor`, `test`, and `chore`.
- Example: `feat(validation): add new validation rule for token names`

## Pull Request Process

1. Fork the repository and create your branch from `main`.
2. Commit your changes with clear and descriptive messages.
3. Ensure your code passes all tests and linting.
4. Push your branch to your forked repository.
5. Open a pull request against the `main` branch of the original repository.
6. Provide a detailed description of your changes and any related issues.

## Testing

- Write tests for any new functionality or changes.
- Run tests before submitting a pull request:
  ```bash
  pnpm run test
  ```

## Documentation

- Update or add documentation for any new features or changes.
- Documentation is generated using Typedoc. To regenerate documentation:
  ```bash
  pnpm run docs
  ```

## Issue Reporting

- Check the existing issues before opening a new one.
- Provide a clear and detailed description of the issue.
- Include steps to reproduce the issue, if applicable.

## Code of Conduct

At Radius Toolkit, we believe in fostering a respectful, inclusive, and collaborative environment. This tool has been developed through learnings from actual projects and clients, with significant contributions from the primary author. While some design choices and patterns may not be ideal, we expect contributors to approach these with an open mind.

We encourage constructive feedback and suggestions for improvement without being overly critical. Please respect the work that has been done and help us make this project better through positive and supportive collaboration.

We are committed to diversity and inclusivity in our language and interactions. All contributors are expected to use inclusive language that respects all individuals regardless of their background. Furthermore, we maintain a strictly non-violent language policy to ensure that our community remains welcoming and safe for everyone.

All contributors are expected to adhere to these principles to maintain a welcoming, productive, and respectful community.

## Contact and Support

Radius Toolkit is maintained by Rangle.io As part of the Radius Meta-Framework.

You can find the source code for this project under Radius Token Tango on [GitHub](https://github.com/rangle/radius-token-tango).

For support, please contact us through our [GitHub repository](https://github.com/rangle/radius-token-tango), indicating `radius-toolkit` as a project. You can also reach out to us at [Rangle.io](https://rangle.io).
