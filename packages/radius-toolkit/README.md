# Radius Toolkit

Radius Toolkit is a library designed to facilitate the development of design systems. It provides tools for framing, validating, and automating tasks involved in managing design tokens and other aspects of product development at scale. Whether you are working on a design system or building tools related to design systems, Radius Toolkit can be used as both a library and a command-line tool to supercharge your efforts.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Library](#library)
  - [CLI](#cli)
- [Validation Formats](#validation-formats)
  - [Radius Simple](#radius-simple)
  - [Radius Layer Subject Type](#radius-layer-subject-type)
- [Features](#features)
- [Configuration and Customization](#configuration-and-customization)
- [Contributing](#contributing)
- [License](#license)
- [Contact and Support](#contact-and-support)

## Installation

You can install Radius Toolkit via npm, yarn, or pnpm.

### Using npm

```bash
npm install radius-toolkit
```

### Using yarn

```bash
yarn add radius-toolkit
```

### Using pnpm

```bash
pnpm add radius-toolkit
```

For CLI usage without installation:

```bash
npx radius-toolkit <command> <options>
```

## Usage

### Library

To use Radius Toolkit as a library, you can import and utilize its functions in your code:

```javascript
import { createValidatorFunctions, generateFileService } from "radius-toolkit";

// Example usage
const validate = createValidatorFunctions("radiusSimpleFormat");
const validationResult = validate(tokenData);

const output = generateFileService("templateName", { tokens: tokenData });
```

For more details, refer to the [API documentation](packages/radius-toolkit/docs/globals.md).

### CLI

Radius Toolkit CLI provides commands for generating and validating tokens.

#### Generate Assets

```bash
npx radius-toolkit generate <tokens-file.json> <options>
```

Generates assets (CSS, Tailwind Configuration) from the tokens file.

for more details, refer to the [CLI documentation for the command](packages/radius-toolkit/src/cli/generate/README.md).

#### Validate Tokens

```bash
npx radius-toolkit validate <tokens-file.json> <options>
```

Validates the tokens in the specified tokens file.

for more details, refer to the [CLI documentation for the command](packages/radius-toolkit/src/cli/validate/README.md).

## Validation Formats

### Radius Simple

The `radius-simple` design token name validator ensures that design tokens follow a consistent and simple naming convention, especially useful in scenarios where all tokens belong to a single token collection. This format is ideal for cases without semantic aliases, although it can still be used in such cases with meaningful names to clearly distinguish between primitive and semantic tokens.

More details can be found [here](packages/radius-toolkit/src/lib/formats/radius-simple).

### Radius Layer Subject Type

The `radius-layer-subject-type` design token name format ensures that design tokens follow a consistent naming convention as the complexity of the token layer increases. This format is ideal for scenarios where multiple modes and layers of aliases are needed, ensuring clarity and distinction among various types of tokens.

More details can be found [here](packages/radius-toolkit/src/lib/formats/radius-layer-subject-type).

To use these formats:

- **Library**: Import directly as `radiusSimpleFormat` and `radiusLayerSubjectTypeFormat` to make use of their functions.
- **CLI**: Use the `--format` flag to specify the desired format for validation.

## Features

### Library Function References

- `generateFileService(templateName, options)`: Generate assets from a token file or string.
- `createValidatorFunctions(format)`: Returns a function that can validate tokens based on the specified format.

### CLI Commands

- **Generate Assets**: Generate CSS and Tailwind configurations from a design tokens file.
- **Validate Tokens**: Validate design tokens using predefined formats.

## Configuration and Customization

Currently, the library and CLI do not support custom formats and templates. These features are planned for the next version.

## Contributing

We welcome contributions to Radius Toolkit. Please see the [CONTRIBUTING.md](packages/radius-toolkit/CONTRIBUTING.md) file for more details.

## License

This project is licensed under the MIT License.

## Contact and Support

Radius Toolkit is maintained by Rangle.io As part of the Radius Meta-Framework.

You can find the source code for this project under Radius Token Tango on [GitHub](https://github.com/rangle/radius-token-tango/packages/radius-toolkit/).

For support, please contact us through our [GitHub repository](https://github.com/rangle/radius-token-tango), indicating `radius-toolkit` as the project. You can also reach out to us at [Rangle.io](https://rangle.io).
