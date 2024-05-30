const { widget } = figma;
const { Text, AutoLayout } = widget;

export type PillProps = BaseProps & TextChildren;

export const Pill: FunctionalWidget<PillProps> = ({ children, ...props }) => (
  <AutoLayout
    name="Subject-pill"
    fill="#FFF"
    cornerRadius={6}
    overflow="visible"
    spacing={10}
    padding={{
      vertical: 2,
      horizontal: 4,
    }}
    verticalAlignItems="center"
    {...props}
  >
    <Text name="actions" fill="#1A1A1A" fontFamily="Roboto Mono" fontSize={10}>
      {children}
    </Text>
  </AutoLayout>
);
