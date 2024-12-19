# Token Types in Design Systems

## Understanding Polymorphic Token Types

Token types in design systems are polymorphic by nature, meaning they should precisely match the level of decision and constraint they represent. This is a crucial concept that ensures token names accurately reflect their intended use and limitations.

### The Principle of Decision-Level Matching

When naming tokens, the type segment must reflect the exact level of decision made about that token's usage. For example:

- If a color token can be used for any color property, use `color`
- If a color token is specifically for text, use `textColor`
- If a color token is specifically for backgrounds, use `backgroundColor`

This isn't just about naming—it's about encoding decisions and constraints directly into the token structure.

## Available Types

### Color Types
- `color` - Generic color token that can be used for any color property
- `backgroundColor` - Color specifically for background properties
- `textColor` - Color specifically for text properties
- `borderColor` - Color specifically for borders
- `outlineColor` - Color specifically for outlines
- `accentColor` - Color specifically for accent properties
- `caretColor` - Color specifically for text input cursors
- `fillColor` - Color specifically for SVG fills
- `strokeColor` - Color specifically for SVG strokes

### Spacing Types
- `spacing` - Generic spacing token that can be used for any spacing property
- `padding` - Spacing specifically for padding
- `margin` - Spacing specifically for margins
- `gap` - Spacing specifically for gaps between elements
- `inset` - Spacing specifically for positioning elements

### Size Types
- `size` - Generic size token that can be used for width or height
- `width` - Size specifically for width
- `height` - Size specifically for height
- `maxWidth` - Size specifically for maximum width
- `maxHeight` - Size specifically for maximum height
- `minWidth` - Size specifically for minimum width
- `minHeight` - Size specifically for minimum height

### Typography Types
- `fontSize` - Size specifically for text
- `lineHeight` - Height specifically for text lines
- `letterSpacing` - Spacing specifically for letters
- `wordSpacing` - Spacing specifically for words
- `fontFamily` - Font family specification
- `fontWeight` - Font weight specification

### Border Types
- `borderWidth` - Width specifically for borders
- `borderRadius` - Radius specifically for border corners
- `borderStyle` - Style specifically for borders
- `outlineWidth` - Width specifically for outlines
- `outlineStyle` - Style specifically for outlines
- `outlineOffset` - Offset specifically for outlines

### Shadow Types
- `boxShadow` - Shadow specifically for boxes
- `textShadow` - Shadow specifically for text
- `dropShadow` - Shadow specifically for drop effects

### Transform Types
- `scale` - Transformation specifically for scaling
- `rotate` - Transformation specifically for rotation
- `translate` - Transformation specifically for translation
- `skew` - Transformation specifically for skewing

### Animation Types
- `transitionProperty` - Property specifically for transition properties
- `transitionDuration` - Duration specifically for transitions
- `transitionTimingFunction` - Timing function specifically for transitions
- `transitionDelay` - Delay specifically for transitions
- `animationDuration` - Duration specifically for animations
- `animationTimingFunction` - Timing function specifically for animations
- `animationDelay` - Delay specifically for animations

### Grid Types
- `gridTemplateColumns` - Template specifically for grid columns
- `gridTemplateRows` - Template specifically for grid rows
- `gridColumn` - Position specifically for grid columns
- `gridRow` - Position specifically for grid rows
- `gridAutoFlow` - Flow specifically for grid auto-placement
- `gridAutoColumns` - Size specifically for auto-generated grid columns
- `gridAutoRows` - Size specifically for auto-generated grid rows

## Examples of Decision-Level Matching

### ❌ Incorrect Usage
```css
primitive.backgroundColor.primary /* Too specific if the color can be used for text or if there's more than one primary color */
component.button.color.primary /* Too generic if the color can only be used for background */
```

### ✅ Correct Usage
```css
primitive.color.primary /* Correctly specifies the color can be used for any color property */
component.button.backgroundColor.primary /* Correctly specifies the color can only be used for backgrounds */
component.button.foregroundColor.primary.light /* Correctly specifies the color can only be used for text and that there's a light variant */
```

## Why This Matters

1. **Self-Documentation**: The type immediately tells other developers how the token can be used
2. **Constraint Enforcement**: Tools can validate that tokens are only used in their intended context
3. **Maintainability**: Makes it clear what needs to be updated when design changes occur
4. **Scalability**: Helps prevent misuse as the design system grows
5. **Clarity**: Removes ambiguity about token usage

## Best Practices

1. **Be Specific**: Always use the most specific type that accurately represents the token's intended use
2. **Match Constraints**: The type should match any technical or design constraints
3. **Consider Context**: Think about how the token will be used in different scenarios
4. **Be Consistent**: Once a type pattern is established, maintain it across similar tokens
5. **Document Decisions**: When choosing between a generic and specific type, document why the decision was made

Remember: The type segment is not just a name — it's a contract that communicates decisions and constraints to everyone using the design system. 