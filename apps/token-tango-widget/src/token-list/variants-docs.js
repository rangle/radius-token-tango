import { calculateSubjectsFromProps } from "../common/token.utils.js";
import { Icon16px } from "../ui/components/icon.js";
import { Pill } from "../ui/components/pill.js";
import { PropDocs } from "./prop-docs.js";
const { widget } = figma;
const { Text, AutoLayout } = widget;
export const EmptyComponentDocs = () => (<AutoLayout name="Component-group" overflow="visible" direction="vertical" spacing={6} padding={{
        vertical: 6,
        horizontal: 3,
    }}>
    <AutoLayout name="component-title" spacing={6} padding={12} verticalAlignItems="center">
      <Text name="empty" fill="#030303" fontFamily="Roboto" fontSize={18} fontWeight={700}>
        No component selected
      </Text>
      <Text name="empty-description" fill="#333333" fontFamily="Roboto" fontSize={12} fontWeight={700}>
        Select a component and click the 'Add Component' button
      </Text>
    </AutoLayout>
  </AutoLayout>);
export const VariantsDocs = ({ name, tokenList, }) => {
    const variants = tokenList && Object.entries(tokenList);
    if (!variants || variants.length < 1)
        return <EmptyComponentDocs />;
    const items = variants.map(([attribute, tokenDict]) => {
        const subjects = calculateSubjectsFromProps(Object.values(tokenDict));
        return {
            name,
            attribute,
            subjects,
            tokens: Object.entries(tokenDict),
        };
    });
    return (<AutoLayout name="Component-Frame" overflow="visible" direction="vertical" padding={{
            top: 6,
            right: 3,
            bottom: 6,
            left: 0,
        }}>
      {items.map(({ name, subjects, attribute, tokens }) => (<>
          <AutoLayout name="Component-Header" stroke={"#aaa"} strokeWidth={1} overflow="visible" spacing="auto" width="fill-parent" height={32} verticalAlignItems="center" strokeDashPattern={[2, 2]}>
            <AutoLayout name="Title" overflow="visible" spacing={10} verticalAlignItems="center">
              <Icon16px icon={"instance"}/>
              <Text name="Component-title" fill="#030303" fontSize={24} fontWeight={700}>
                {name}
              </Text>
              <Text name="Component-title" fill="#030303" fontSize={18} fontWeight={400}>
                {attribute}
              </Text>
            </AutoLayout>
            {subjects.length > 0 ? (<AutoLayout name="Subject-list-group" fill="#C6EFC4" cornerRadius={6} overflow="visible" spacing={10} padding={{
                    vertical: 2,
                    horizontal: 4,
                }} verticalAlignItems="center">
                <AutoLayout name="subject-group" spacing={6} verticalAlignItems="center">
                  <Text name="subjects:" fill="#000" fontFamily="Roboto Mono" fontSize={10}>
                    subjects:
                  </Text>
                  {subjects.map((subject, idx) => (<Pill key={idx}>{subject}</Pill>))}
                </AutoLayout>
              </AutoLayout>) : (<AutoLayout name="subject-group" spacing={6} verticalAlignItems="center"></AutoLayout>)}
          </AutoLayout>
          {tokens.length > 0 ? (<AutoLayout name="Component-Content" stroke={"#aaa"} strokeWidth={1} overflow="visible" direction="vertical" spacing={6} padding={{
                    top: 6,
                    right: 0,
                    bottom: 0,
                    left: 4,
                }} strokeDashPattern={[2, 2]}>
              {tokens.map(([key, value]) => (<PropDocs prop={{
                        name: key,
                        value: value,
                        from: "variable",
                    }}/>))}
            </AutoLayout>) : (<AutoLayout name="default-values" spacing={6} padding={6} verticalAlignItems="center">
              <Text fontSize={12}>Same properties as default</Text>
            </AutoLayout>)}
        </>))}
    </AutoLayout>);
};
