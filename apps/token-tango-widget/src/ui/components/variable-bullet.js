const { widget } = figma;
const { Text, AutoLayout, Frame, SVG } = widget;
import { Icon16px } from "./icon.js";
export const VariableBullet = ({ name, issues = [], children, ...props }) => {
    const segments = name.split(/[/.]/);
    const [first, second, third, ...rest] = segments;
    const errorSegments = issues.flatMap(({ segments }) => segments);
    return (<AutoLayout name="FormatBullet" stroke="#EFEFEF" cornerRadius={16} height={24} verticalAlignItems="center" width={"hug-contents"} {...props}>
      <AutoLayout name="Spacer" fill="#FFF" overflow="visible" spacing={10} padding={{
            vertical: 4,
            horizontal: 8,
        }} width={4} verticalAlignItems="center"/>
      <AutoLayout name="TokenType" fill="#fff" overflow="visible" spacing={4} padding={4} verticalAlignItems="center">
        <Icon16px icon="variables" size={11} color={issues.length > 0 ? "#F00" : "#FFF"}/>
      </AutoLayout>
      <AutoLayout name="Layer" stroke="#EFEFEF" overflow="visible" spacing={4} padding={4} height="fill-parent" verticalAlignItems="center">
        <Text name="layer" fill={errorSegments.includes(first) ? "#FF0000" : "#262626"} verticalAlignText="center" fontFamily="Roboto Mono" fontSize={12}>
          {first}
        </Text>
      </AutoLayout>
      <AutoLayout name="Dot" fill="#FFF" overflow="visible" spacing={4} padding={{
            vertical: 4,
            horizontal: 0,
        }} height="fill-parent" verticalAlignItems="center">
        <Text name="." fill="#262626" verticalAlignText="center" fontFamily="Roboto Mono" fontSize={12}>
          .
        </Text>
      </AutoLayout>
      <AutoLayout name="Subject" stroke="#F8FBD2" overflow="visible" spacing={4} padding={4} height="fill-parent" verticalAlignItems="center">
        <Text name="subject" fill={errorSegments.includes(second) ? "#FF0000" : "#262626"} verticalAlignText="center" fontFamily="Roboto Mono" fontSize={12}>
          {second}
        </Text>
      </AutoLayout>
      <AutoLayout name="Dot" fill="#FFF" overflow="visible" spacing={4} padding={{
            vertical: 4,
            horizontal: 0,
        }} height="fill-parent" verticalAlignItems="center">
        <Text name="." fill="#262626" verticalAlignText="center" fontFamily="Roboto Mono" fontSize={12}>
          .
        </Text>
      </AutoLayout>
      <AutoLayout name="Type" stroke="#E9F3FF" overflow="visible" spacing={4} padding={4} height="fill-parent" verticalAlignItems="center">
        <Text name="type" fill={errorSegments.includes(third) ? "#FF0000" : "#262626"} verticalAlignText="center" fontFamily="Roboto Mono" fontSize={12}>
          {third}
        </Text>
      </AutoLayout>
      {rest.length > 0 ? (<AutoLayout name="Dot" fill="#FFF" overflow="visible" spacing={4} padding={{
                vertical: 4,
                horizontal: 0,
            }} height="fill-parent" verticalAlignItems="center">
          <Text name="." fill="#262626" verticalAlignText="center" fontFamily="Roboto Mono" fontSize={12}>
            .
          </Text>
        </AutoLayout>) : (<></>)}
      <AutoLayout name="Attributes" stroke="#FFF0FE" overflow="visible" spacing={4} padding={4} height="fill-parent" verticalAlignItems="center">
        <Text name="attributes" fill="#262626" verticalAlignText="center" fontFamily="Roboto Mono" fontSize={12}>
          {rest.join(".")}
        </Text>
      </AutoLayout>
      <AutoLayout name="Spacer" overflow="visible" spacing={4} padding={{
            vertical: 4,
            horizontal: 0,
        }} height={32} verticalAlignItems="center"/>
    </AutoLayout>);
};
