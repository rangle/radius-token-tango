# Radius Layer Subject Type Format Rules

The `radius-layer-subject-type` design token name format ensures that design tokens follow a consistent naming convention as the complexity of the token layer increases. This format is ideal for scenarios where multiple modes and layers of aliases are needed, ensuring clarity and distinction among various types of tokens.

## Format

The `radius-layer-subject-type` format is designed to provide a clear and structured naming convention for design tokens, especially in complex systems where multiple layers and modes of aliases are needed. This structure helps maintain consistency, readability, and manageability across different tokens.

### Layers

Layers are the first segment of the token name and indicate the abstraction level of the token. Common layers include:

- **Primitive**: These are the core tokens that define basic values such as colors, font sizes, and spacings. Examples of layer names can be `primitive`, `core`, or `base`. Primitive layers have no subject segment.
- **Semantic**: These tokens provide a more abstract meaning to the primitives. They are used to convey the intention or usage. Some teams will use simply `semantic` or `alias` as the layer name, but others may use more specific names like `brand`, `density`, or `mode`.
- **Component**: These tokens are tied to specific UI components, providing styles specific to component implementations. This is usually necessary to isolate component styles in the early stages of a design system.

### Subjects

The subject segment, which follows the layer, provides additional context and is mandatory for semantic and component tokens but absent in primitive tokens. This helps in further categorizing the tokens based on their usage or association.
For semantic tokens they usually represent abstract concepts like `action`, `static`, or `interactive`. Subjects are one of the core ways to describe the semantic structure of a Design System.
For component tokens subjects usually represent the specific UI element the token applies to (ex.: 'button' or 'badge').
For example, in `component.button.background.primary`, `button` is the subject that indicates the specific UI element the token applies to, whereas in `semantic.action.background.destructive`, `action` is the subject that represents the abstract concept of an action.

### Types

Types, the third segment in the name, define what the token represents, such as color, size, or spacing. Consistent naming for types is crucial for clarity and to enable automation. Types should be drawn from a predefined list to ensure uniformity. You can find the list of types [here](../token-types.md). Designers should prefer more specific types over generic ones to ensure that the tokens are self-explanatory and easy to understand. For example, `component.button.background.primary` is more descriptive and actionable than `component.button.color.primary.background`.

### Attributes

Attribute segments follow the type and can be used to provide further detail or variation within a type. Attributes are flexible and can be tailored to fit the specific needs of the design system. For example, `color.primary.light` where `light` is an attribute providing a variation of the primary color.

## Rules

- **Minimum Three Segments (minimum-three-segments)**:
  Token names must have at least three segments. Primitive tokens have exactly three segments, while other layers have four or more segments.

- **Layer as First Segment (layer-as-first-segment)**:
  The first segment of the token name must indicate the layer. Common layers include `primitive`, `semantic`, or `component`, but can vary by the design team's preferences.

- **Subject for Non-Primitive Tokens (subject-for-non-primitive-tokens)**:
  The subject segment is mandatory for semantic or component tokens but absent in primitive tokens.

- **Attribute Segments (attribute-segments)**:
  The fourth segment and subsequent segments can be anything the designers want to use to distinguish tokens.

- **Lowercase or CamelCase Segments (lowercase-or-camelCase-segments)**:
  Each segment can be in lowercase or camelCase. Spaces, hyphens, or other special characters are strongly discouraged.

- **Dot Separation (dot-separation)**:
  Segments within a token name must be separated by a single dot (`.`). No spaces or other punctuation marks are allowed.

- **No Leading or Trailing Dots (no-leading-or-trailing-dots)**:
  Token names must not start or end with a dot.

- **Length Constraints (length-constraints)**:
  Each segment within a token name should be between 1 to 20 characters long.

- **No Consecutive Dots (no-consecutive-dots)**:
  Multiple consecutive dots (`..`) are not allowed.

- **Consistent Type Naming (consistent-type-naming)**:
  Ensure the types are consistent and follow a predefined naming convention.

### Warnings

- Same prefix for collections to allow for easy filtering and grouping.
- Subjects should not be reused across different layers to avoid confusion.
- Attributes should be used sparingly and only when necessary to avoid overcomplicating the token structure. Avoid having unnecessary levels of nesting if there is not enough variation to justify it.
- Repetition of the same information in different segments should be avoided to keep the token names concise and clear.
- Avoid using genertic types like 'color' or 'spacing' when more specific types are present in the name of the token and can be used in its place.
- primitive tokens should not contain aliases.
- non-primitive tokens should only contain references to primitive values, and not arbitrary values.

For detailed rules, please refer to the [detailed rules JSON file](./rules.md).

## Usage

Our library, `radius-toolkit`, provides functions to validate this format. You can use it as follows:

```typescript
import { createValidator } from "radius-toolkit";

const validateTokenName = createValidator({
  format: "radius-layer-subject-type",
});

// Example usage:
const tokenName = "primitive.color.primaryBackground";
console.log(validateTokenName(tokenName)); // Output: true
```

## Contributing

We welcome contributions to improve the radius-layer-subject-type design token name validator. Please feel free to submit issues or pull requests on our GitHub repository.

## License

This project is licensed under the MIT License.
