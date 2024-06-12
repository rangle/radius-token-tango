import { Icon16px } from "./icon.js";
const { widget } = figma;
const { Text, AutoLayout } = widget;
export const Button = ({ children, icon, ...props }) => (<AutoLayout name="Button" cornerRadius={4} overflow="visible" spacing={4} padding={{
        vertical: 4,
        horizontal: 8,
    }} verticalAlignItems="center" {...props}>
    <Text name="Label" fill="#DADADA" lineHeight="140%" fontFamily="Inter" fontSize={13} letterSpacing={0.24}>
      {children}
    </Text>
    <Icon16px icon={icon} color="#ffffff"/>
  </AutoLayout>);
