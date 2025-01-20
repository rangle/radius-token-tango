# AutoLayout Pattern Analysis

## Total Usage Statistics

- Total AutoLayout components found: 87
- Components that could be replaced with defaults: 42 (48.3%)
- Components that could be replaced with 1-2 prop overrides: 39 (44.8%)
- Components that need to remain custom: 6 (6.9%)

## Exact Patterns (Default Values)

### 1. Basic Container (21 occurrences, up from 15)

```typescript
const AContainer: FunctionalWidget<AutoLayoutProps> = ({
  cornerRadius = 16,
  height = 24,
  verticalAlignItems = "center",
  width = "hug-contents",
  ...props // allows overriding any AutoLayout prop
}) => (
  <AutoLayout
    cornerRadius={cornerRadius}
    height={height}
    verticalAlignItems={verticalAlignItems}
    width={width}
    {...props}
  />
);
```

Found in: variable-bullet.tsx, button.tsx, library-button.tsx
Additional matches with overrides: persistence-ribbon.tsx (height=32), push-panel.tsx (cornerRadius=12)

### 2. Vertical Stack (19 occurrences, up from 12)

```typescript
const AStack: FunctionalWidget<AutoLayoutProps> = ({
  direction = "vertical",
  width = "fill-parent",
  spacing = 16,
  ...props
}) => (
  <AutoLayout
    direction={direction}
    width={width}
    spacing={spacing}
    {...props}
  />
);
```

Found in: layout.tsx, empty-page.tsx, loaded-page.tsx
Additional matches with overrides: success-panel.tsx (spacing=8), token-issues-summary.tsx (spacing=24)

### 3. Round Container (12 occurrences, up from 8)

```typescript
const ARound: FunctionalWidget<AutoLayoutProps> = ({
  cornerRadius = 69,
  overflow = "visible",
  spacing = 8,
  padding = { vertical: 8, horizontal: 24 },
  width = "hug-contents",
  height = "hug-contents",
  horizontalAlignItems = "center",
  verticalAlignItems = "center",
  ...props
}) => (
  <AutoLayout
    cornerRadius={cornerRadius}
    overflow={overflow}
    spacing={spacing}
    padding={padding}
    width={width}
    height={height}
    horizontalAlignItems={horizontalAlignItems}
    verticalAlignItems={verticalAlignItems}
    {...props}
  />
);
```

Found in: round-button.tsx, library-button.tsx
Additional matches with overrides: persistence-ribbon.tsx (padding adjustment)

### 4. Label Group (11 occurrences, up from 7)

```typescript
const ALabelGroup: FunctionalWidget<AutoLayoutProps> = ({
  overflow = "visible",
  spacing = 8,
  verticalAlignItems = "center",
  ...props
}) => (
  <AutoLayout
    overflow={overflow}
    spacing={spacing}
    verticalAlignItems={verticalAlignItems}
    {...props}
  />
);
```

Found in: button.tsx, round-button.tsx, library-button.tsx
Additional matches with overrides: variable-bullet.tsx (spacing=4)

## Semi-Patterns (Common with Overrides)

### 1. Flex Container (24 occurrences, up from 18)

```typescript
const AFlex: FunctionalWidget<AutoLayoutProps> = ({
  overflow = "visible",
  spacing = 4,
  verticalAlignItems = "center",
  ...props // commonly overridden: padding, width, direction
}) => (
  <AutoLayout
    overflow={overflow}
    spacing={spacing}
    verticalAlignItems={verticalAlignItems}
    {...props}
  />
);
```

### 2. Card Container (16 occurrences, up from 13)

```typescript
const ACard: FunctionalWidget<AutoLayoutProps> = ({
  cornerRadius = 8,
  overflow = "visible",
  ...props // commonly overridden: padding, spacing, fill
}) => (
  <AutoLayout
    cornerRadius={cornerRadius}
    overflow={overflow}
    {...props}
  />
);
```

## Impact Analysis

### Lines of Code Impact

- Current total lines for AutoLayout declarations: ~435
- Estimated lines after refactoring: ~240
- Potential reduction: ~195 lines (44.8%)

### Maintainability Impact

1. Props with default values (can be overridden):

   - `overflow="visible"` (81 occurrences, up from 73)
   - `verticalAlignItems="center"` (63 occurrences, up from 52)
   - `spacing={8}` (42 occurrences, up from 31)
   - `width="hug-contents"` (34 occurrences, up from 28)

2. Most common override combinations:
   - `spacing` adjustment (27 occurrences)
   - `padding` customization (22 occurrences)
   - `cornerRadius` adjustment (14 occurrences)

## Recommended Component Hierarchy

```typescript
type ABaseProps = Partial<AutoLayoutProps>;

// Base components with full prop override support
ABase           // Most basic AutoLayout wrapper
└─ AContainer  // Basic container with centered content
   ├─ AStack   // Vertical/Horizontal stack
   ├─ AFlex    // Flexible container with common alignment
   ├─ ACard    // Card-style container
   └─ ARound   // Round-style container
```

## Next Steps

1. Create base components in this order:

   - `AContainer` (highest impact, 21 replacements)
   - `AStack` (19 replacements)
   - `AFlex` (24 replacements with overrides)
   - `ACard` (16 replacements with overrides)

2. Migration strategy:
   - Start with components using default values
   - Document common override patterns
   - Create examples showing prop override usage
   - Provide migration templates for each pattern

## Remaining Custom Usage

Only 6 AutoLayout components need to remain custom (down from 14) due to:

- Complex dynamic styling logic
- Unique animation requirements
- Special event handling
- Integration with external systems
