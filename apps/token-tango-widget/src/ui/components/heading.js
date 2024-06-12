const { widget } = figma;
const { Text } = widget;
export const Heading = ({ children, ...props }) => {
    return (<Text name="Heading" fill="#262626" lineHeight="140%" fontFamily="Roboto" fontSize={12} fontWeight={500} {...props}>
      {children}
    </Text>);
};
