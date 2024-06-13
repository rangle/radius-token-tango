const { widget } = figma;
const { Text } = widget;

export type HeadingProps = TextProps & TextChildren;

export const Heading: FunctionalWidget<HeadingProps> = ({
  children,
  ...props
}) => {
  return (
    <Text
      name="Heading"
      fill="#262626"
      lineHeight="140%"
      fontFamily="Inter"
      fontSize={12}
      fontWeight={500}
      {...props}
    >
      {children}
    </Text>
  );
};
