# Radius Simple Format Rules

## Minimum Two Segments (minimum-two-segments)

Token names must have at least two segments. The first segment indicates the token type.

_Valid_: `color.primary`
_Invalid_: `primaryColor`

## Type as First Segment (type-as-first-segment)

The first segment of the token name must indicate the token type. Types should be drawn from a predefined list. You can find the list of types [here](../token-types.md).

_Valid_: `borderRadius.small`
_Invalid_: `radius.small`

## Lowercase or CamelCase

Each segment can be in lowercase or camelCase. Spaces, hyphens or other special characters are strongly discouraged.

_Valid_: `fontSize.large`
_Invalid_: `font size.large`

## Dot Separation

Segments within a token name must be separated by a single dot (`.`). No spaces or other punctuation marks are allowed.

_Valid_: `spacing.medium`
_Invalid_: `spacing.standard-medium`

## No Leading or Trailing Dots

Token names must not start or end with a dot.

_Valid_: `.borderRadius.small`
_Invalid_: `.borderRadius.small`

## Length

Each segment within a token name should be between 1 to 20 characters long.

_Valid_: `borderRadius.small.relativelyLongSegment`
_Invalid_: `borderRadius.small.thisIsIndeedAVeryLongSegment`

## No Consecutive Dots

Multiple consecutive dots (`..`) are not allowed.

_Valid_: `spacing..medium`
_Invalid_: `spacing..medium`
