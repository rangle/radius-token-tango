# Generator Mappings

Generator mappings provide a powerful mechanism to transform token values between the source (e.g., Figma) and the generated target (e.g., CSS). This system allows for flexible and customizable value transformations for each export type.

## File Structure

Create mapping files in the `./mapping/` directory:

1. `<templateName>-generator.ts` (e.g., `css-generator.ts`)
2. `all-generator.ts`
3. `generator.ts`

The generate command will look for these files in order, allowing for template-specific and global mappings.

## Mapping Structure

The mapping file exports a default object conforming to the `GeneratorMappingDictionary` type:

```typescript
export default {
  [templateName]: Array<GeneratorMappingDictionaryItem>,
};
```

Each `GeneratorMappingDictionaryItem` can be either:

1. A generic mapping: `[from, to]`
2. A token-specific mapping: `[tokenPattern, [[from, to], ...]]`

## Mapping Types

### Generic Mapping

```typescript
[from: string | RegExp, to: string | ((value: string, match?: RegExpMatchArray) => string)]
```

Examples:

```typescript
["color", "color"][(/Regular/g, "400")][ // Simple value replacement // RegExp replacement
  (/^full$/g, (value) => `100%; /* ${value} */`)
]; // Function replacement
```

### Token-specific Mapping

```typescript
[tokenPattern: RegExp, mappings: Array<GenericMapping>]
```

Example:

```typescript
[
  /--typography/,
  [
    [/Regular/g, "400"],
    [/Bold/g, "700"],
  ],
];
```

## Advanced Usage

### RegExp with Capture Groups

You can use RegExp capture groups for more complex transformations:

```typescript
[/--letterSpacing/, [[/(-?)([0-9]*)%/g, "calc($1$2em/100)"]]];
```

### Function Replacements

Functions can access the full RegExp match array:

```typescript
[
  /^([0-9][0-9])px$/g,
  (value, matches) => `${Number(matches[1]) / 16.0}rem; /* ${value} */`,
];
```

## Full Example

Here's a comprehensive example of a generator mapping file:

```typescript
// css-generator.ts
import { GeneratorMappingDictionary } from "../../lib/tokens";

export default {
  css: [
    ["color", "color"],
    [/--asset/, [[/(http.*)/g, `'$&'`]]],
    [
      /--typography/,
      [
        [/Light/g, "300"],
        [/Regular/g, "400"],
        [/Medium/g, "500"],
        [/Semi Bold/g, "600"],
        [/Bold/g, "700"],
        [/Extra Bold/g, "800"],
        [/Heavy/g, "900"],
        [/Black/g, "900"],
      ],
    ],
    [/--letterSpacing/, [[/(-?)([0-9]*)%/g, "calc($1$2em/100)"]]],
    [/--boxShadow/, [[/\d+(?![^()]*\))/g, "$&px"]]],
    [
      /--direction.*/,
      [
        [/^vertical$/, "column"],
        [/^horizontal$/, "row"],
      ],
    ],
  ],
} satisfies GeneratorMappingDictionary;
```

This system provides a flexible and powerful way to transform token values during the generation process, allowing for seamless integration between design tools and generated code -- and still keep the file relatively small and easy to read.
