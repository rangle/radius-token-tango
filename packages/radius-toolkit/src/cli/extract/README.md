# extract

Extracts a built-in template from the toolkit into a local directory for customization.

## Usage

```
npx radius-toolkit extract <template-name> [options]
```

## Arguments

- `<template-name>`: Name of one of the built-in templates to extract (ex.: "css-variables" or "tailwind-config")

## Options

- `-o, --output <OUTPUT>`: Directory to extract the template to (default: "./extracted-templates")

## Description

This command extracts a built-in template from the toolkit into a local directory for customization. The extracted template can be modified and used as a custom template with the `generate` command.

## Examples

Extract the CSS Variables template to a custom directory:

```
npx radius-toolkit extract css-variables -o ./custom-templates
```

Extract the Tailwind Configuration template to the default directory:

```
npx radius-toolkit extract tailwind-config
```
