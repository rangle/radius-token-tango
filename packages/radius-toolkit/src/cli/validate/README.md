# validate-token-name

Checks if a token name is valid and lists error messages and warnings if it is not.

## Usage

```
npx radius-toolkit validate-token-name <name> [options]
```

## Arguments

- `<name>`: Token name to validate

## Options

- `-f, --format <FORMAT>`: Format to use for validation (default: "radius-layer-subject-type")
- `-o, --output <OUTPUT>`: Format for the output of the validation (choices: "text", "json", default: "text")

## Description

This command validates a given token name against a specified format. It checks if the token name is valid and provides error messages and warnings if it's not.

## Examples

Validate a token name using the default format:

```
npx radius-toolkit validate-token-name my-token-name
```

Validate a token name using a specific format and JSON output:

```
npx radius-toolkit validate-token-name my-token-name -f custom-format -o json
```
