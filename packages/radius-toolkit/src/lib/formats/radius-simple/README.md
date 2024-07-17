# Radius Simple Design Token Name Validator

The `radius-simple` design token name validator ensures that design tokens follow a consistent and simple naming convention, especially useful in scenarios where all tokens belong to a single token collection. This format is ideal for cases without semantic aliases, although it can still be used in such cases with meaningful names to clearly distinguish between primitive and semantic tokens.

## Format

Design token names in the `radius-simple` format are structured with specific segments separated by dots (`.`). The first segment always indicates the token type, followed by other descriptive segments.

## Rules

- Minimum Two Segments
- Dot Separation
- No Consecutive Dots
- No Leading or Trailing Dots
- Lowercase or CamelCase
- Length
- Type as First Segment

For detailed rules, please refer to the [detailed rules JSON file](./rules.md).

## Examples

### Valid Token Names

- `color.primaryBackground`
- `fontSize.large`
- `spacing.medium`
- `borderRadius.small`

### Invalid Token Names

- `color-primaryBackground` (Uses hyphen instead of dot)
- `font_size.large` (Uses underscore instead of camelCase or lowercase)
- `spacing..medium` (Contains consecutive dots)
- `.borderRadius.small` (Starts with a dot)
- `borderRadius.small.` (Ends with a dot)
- `borderRadius.small.veryLongSegmentThatExceedsTwentyCharacters` (Contains a segment longer than 20 characters)
- `this.is.an.exceptionally.long.token.name.that.exceeds.fifty.characters.in.total.length` (Exceeds 50 characters)

## Usage

Our library, `radius-toolkit`, provides functions to validate this format. You can use it as follows:

```typescript
import { createValidator } from "radius-toolkit";

const validateTokenName = createValidator({ format: "radius-simple" });

// Example usage:
const tokenName = "color.primaryBackground";
console.log(validateTokenName(tokenName)); // Output: : [errors: TokenNameIssue[], warnings: TokenNameIssue[]]
```

## Detailed Rules

Each rule is described in detail in a separate file. Link to Detailed Rules.

## Contributing

We welcome contributions to improve the radius-simple design token name validator. Please feel free to submit issues or pull requests on our GitHub repository.
