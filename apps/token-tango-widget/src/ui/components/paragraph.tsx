import { typography } from "@repo/bandoneon";
const { widget } = figma;
const { Text } = widget;

export type ParagraphProps = TextProps & TextChildren;

export const Paragraph: FunctionalWidget<ParagraphProps> = ({
  children,
  ...props
}) => {
  return (
    <Text name="paragraph" {...typography.body} {...props}>
      {children}
    </Text>
  );
};
