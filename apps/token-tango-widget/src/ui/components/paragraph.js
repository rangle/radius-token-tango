const { widget } = figma;
const { Text } = widget;
export const Paragraph = ({ children, ...props }) => {
    return (<Text name="paragraph" fill="#262626" lineHeight="140%" fontFamily="Roboto" fontSize={9} fontWeight={400} {...props}>
      {children}
    </Text>);
};
