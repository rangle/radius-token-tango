import { Icon16px } from "./icon.js";
const { widget } = figma;
const { Text, AutoLayout } = widget;
export const WarningBadge = ({ children }) => {
    return (<AutoLayout name="WarningBadge" overflow="visible" spacing={2} width={121} verticalAlignItems="center">
      <Icon16px name="icon" icon="warning"/>
      <Text name="WarningsLabel" fill="#696969" fontFamily="Roboto" fontSize={12} fontWeight={500}>
        {children}
      </Text>
    </AutoLayout>);
};
