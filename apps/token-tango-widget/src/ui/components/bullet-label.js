const { widget } = figma;
const { Text, AutoLayout, Ellipse } = widget;
const colors = {
    green: "#09C000",
    amber: "#f1ba13",
    red: "#da0000",
    white: "#ffffff",
    black: "#232323",
};
export const BulletLabel = ({ color = "black", children, }) => {
    return (<AutoLayout name="BulletLabel" overflow="visible" spacing={12} verticalAlignItems="center">
      <Ellipse name="Icon" fill={colors[color]} width={8} height={8}/>
      <Text name="Label" fill="#232323" lineHeight="100%" fontFamily="Roboto">
        {children}
      </Text>
    </AutoLayout>);
};
