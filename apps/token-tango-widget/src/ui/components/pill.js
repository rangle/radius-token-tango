const { widget } = figma;
const { Text, AutoLayout } = widget;
export const Pill = ({ children, ...props }) => (<AutoLayout name="Subject-pill" fill="#FFF" cornerRadius={6} overflow="visible" spacing={10} padding={{
        vertical: 2,
        horizontal: 4,
    }} verticalAlignItems="center" {...props}>
    <Text name="actions" fill="#1A1A1A" fontFamily="Roboto Mono" fontSize={10}>
      {children}
    </Text>
  </AutoLayout>);
