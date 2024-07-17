# generate

Generate outputs from design tokens using built-in or custom templates with powerful value mapping capabilities.

## Usage

```
npx radius-toolkit generate <fileName> [options]
```

## Arguments

- `<fileName>`: Token file to generate outputs from

## Options

- `-t, --template <TEMPLATE>`: Built-in template to use (default: "css")
- `-c, --custom-template <TEMPLATE>`: Custom template module to use
- `-T, --template-dir <TEMPLATE_DIR>`: Directory for custom template modules
- `-s, --stdin`: Accept input from stdin
- `-o, --output <OUTPUT>`: Output file

## Description

The `generate` command creates outputs from design tokens using built-in or custom templates. It supports various input and output methods and includes a powerful value mapping system for transforming token values.

## Examples

Generate CSS output using the default template:

```
npx radius-toolkit generate tokens.json
```

Use a specific built-in template (e.g., TailwindCSS):

```
npx radius-toolkit generate tokens.json -t tailwind
```

Use a custom template:

```
npx radius-toolkit generate tokens.json -c myCustomTemplate.ts -T ./my-templates
```

Read from stdin and output to a file:

```
cat tokens.json | npx radius-toolkit generate -s -o output.css
```

## Templates

Templates can be built-in or custom modules that generate output from design tokens. Built-in templates are included with the toolkit, while custom templates can be created and used by specifying the module path.

### Built-in Templates

Built-in templates are located in `./templates/` and include:

- `css` -- for generating css variables using the `--` prefix and organized in css layers
- tailwind -- for generating a TailwindCSS configuration file

You can also write custom template files using typescript or mustache.

A typescript custom templates should export:

- `name`: Template identifier
- `render(data, options)`: Function returning generated output
- an optional `formatFileName` function to customize output file names.

Example:

```typescript
import type { TemplateModule } from "radius-toolkit";

export default {
  name: "my-custom-template",
  render: (data, options) => {
    // Process data and return buffer
    return `Hello, ${data.layer[0].name}!`;
  },
} satisfies TemplateModule;
```

You can see more details of the `TemplateModule` type in the [Toolkit documentation](../../../docs/type-aliases/TemplateModule.md).

## Generator Value Mappings

Create mapping files in `./mapping/` to define custom value transformations:

- `<templateName>-generator.ts` (e.g., `css-generator.ts`)
- `all-generator.ts`
- `generator.ts`

Example (simplified):

```typescript
// css-generator.ts
export default {
  css: [
    ["colour", "color"],
    [
      /--typography/,
      [
        [/Regular/g, "400"],
        [/Bold/g, "700"],
      ],
    ],
    [/--letterSpacing/, [[/(-?)([0-9]*)%/g, "calc($1$2em/100)"]]],
  ],
};
```

For detailed information on creating generator mappings, see [GENERATOR_MAPPINGS.md](./GENERATOR_MAPPINGS.md).

## Notes

- Template resolution order: specified directory, CWD, `./templates`, `./src/templates`, `./dist/templates`
- Default output filename is based on input file and template used
- Errors during the generation process are caught and logged to the console

For more detailed information, refer to the main CLI documentation.
