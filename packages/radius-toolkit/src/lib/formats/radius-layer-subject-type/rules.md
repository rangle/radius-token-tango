# Radius Layer Subject Type Format Rules

## Minimum Three Segments (minimum-three-segments)

Token names must have at least three segments. Primitive tokens have exactly three segments, while other layers have four or more segments.

_Valid_: `primitive.color.primary`
_Invalid_: `primitive.color`

## Layer as First Segment (layer-as-first-segment)

The first segment of the token name must indicate the layer and not the type. Common layer names include `primitive`, `semantic`, or `component`, but can vary by the design team's preferences.

_Valid_: `primitive.color.primary`
_Invalid_: `color.primary`

## Subject for Non-Primitive Tokens (subject-for-non-primitive-tokens)

The subject segment is mandatory for semantic or component tokens but absent in primitive tokens. Second segment should not be a type in this case.

_Valid_: `semantic.action.color.primary`
_Invalid_: `primitive.action.color.primary`

## Attribute Segments (attribute-segments)

The fourth segment and subsequent segments can be anything the designers want to use to distinguish tokens.

_Valid_: `semantic.action.color.primary.intense`
_Invalid_: `semantic.action.color`

## Lowercase or CamelCase Segments (lowercase-or-camelCase-segments)

Each segment can be in lowercase or camelCase. Spaces, hyphens, or other special characters are strongly discouraged.

_Valid_: `semantic.action.color.primary.light`
_Invalid_: `semantic.action.color.primary.Light`

## Dot Separation (dot-separation)

Segments within a token name must be separated by a single dot (`.`). No spaces or other punctuation marks are allowed.

_Valid_: `semantic.action.color.primary.light`
_Invalid_: `semantic color primary light`

## No Leading or Trailing Dots (no-leading-or-trailing-dots)

Token names must not start or end with a dot.

_Valid_: `semantic.action.color.primary.light`
_Invalid_: `.semantic.action.color.primary.light`

## Length Constraints (length-constraints)

Each segment within a token name should be between 1 to 20 characters long.

_Valid_: `semantic.action.color.primary.light`
_Invalid_: `semantic.action.color.primary.thisIsIndeedAVeryLongSegment`

## No Consecutive Dots (no-consecutive-dots)

Multiple consecutive dots (`..`) are not allowed.

_Valid_: `semantic.action.color.primary..light`
_Invalid_: `semantic.action.color.primary..light`

## Consistent Type Naming (consistent-type-naming)

The third segment of the token name (or the second in the case of primitive tokens) must indicate the token type. Types should be drawn from a predefined list. You can find the list of types [here](../token-types.md).

_Valid_: `primitive.borderRadius.small`
_Invalid_: `primitive.radius.small`

## Modes should be unique to Collections

Ensure that modes are unique to each collection to avoid conflicts and maintain semantic consistency within the collection.

Example: If a collection has a mode named `dark`, another collection should not use the same mode name.

### Warnings

## Same Prefix for Collections

Ensure that all tokens within a collection share a common prefix to facilitate filtering and grouping. This prefix helps in organizing and managing tokens efficiently.

Example: All tokens in the primitive tokens collection should start with the prefix `primitive`.

## Subjects Should Not Be Reused Across Different Layers

Avoid using the same subject name across different layers (e.g., button, action, interactive) to prevent confusion and maintain clarity in token naming.

Example: If you use `component.button.background.primary` in one layer, avoid using the same subject in another layer like `semantic.button.background.primary`. Instead, use a different subject name, like `action`, to differentiate between the layers and represent the right level of abstraction for that layer: `semantic.action.background.primary`

## Attributes Should Be Used Sparingly and Only When Necessary

Use attributes only when necessary to prevent overcomplicating the token structure. Avoid unnecessary levels of nesting unless there is sufficient variation to justify it.

Example: Instead of `component.button.background.primary.solid.intense.alternate`, use `component.button.background.solid.alternate` if there is are no other variations to each one of these segments.

## Repetition of the Same Information in Different Segments Should Be Avoided

Avoid repeating the same information in different segments to keep token names concise and clear.

Example: Instead of `semantic.action.typography.font.fontFamily.primary`, simplify it to `semantic.action.fontFamily.primary`.

## Avoid Using Generic Types Like ‘color’ or ‘spacing’ When More Specific Types Are Present

Avoid generic types like color or spacing when more specific types can be used. This enhances clarity and specificity in token names.

Example: Use `borderColor` instead of `color` for tokens related to border colors, such as `component.button.borderColor.default`.

## Primitive Tokens Should Not Contain Aliases

Primitive tokens should be direct values and not contain aliases to other tokens to maintain simplicity and directness.

Example: Use `primitive.color.primaryBase = '#ff0000'` instead of `primitive.color.primary = 'primitive.color.red500'`.

## Non-Primitive Tokens Should Only Contain References to Primitive Values, Not Arbitrary Values

Non-primitive tokens should reference primitive tokens to maintain consistency and avoid arbitrary values.

Example: `component.button.backgroundColor.default = primitive.color.primary` instead of `component.button.backgroundColor.default = '#ff0000'`.
