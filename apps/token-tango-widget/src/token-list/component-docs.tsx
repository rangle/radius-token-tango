import { ComponentUsage } from "../common/token.types.js";
import { calculateSubjectsFromProps } from "../common/token.utils.js";
import { Icon16px, IconProps } from "../ui/components/icon.js";
import { Pill } from "../ui/components/pill.js";
import { PropDocs } from "./prop-docs.js";

const { widget } = figma;
const { Text, AutoLayout } = widget;

export type ComponentDocsProps = {
  usage: ComponentUsage | undefined;
  isChildren?: boolean;
  isDeleted: (id: string) => boolean;
  deleteComponent: (id: string) => void;
};

export const EmptyComponentDocs = () => (
  <AutoLayout
    name="Component-group"
    overflow="visible"
    direction="vertical"
    spacing={6}
    padding={{
      vertical: 6,
      horizontal: 3,
    }}
  >
    <AutoLayout
      name="component-title"
      spacing={6}
      padding={12}
      verticalAlignItems="center"
    >
      <Text
        name="empty"
        fill="#030303"
        fontFamily="Roboto"
        fontSize={18}
        fontWeight={700}
      >
        No component selected
      </Text>
      <Text
        name="empty-description"
        fill="#333333"
        fontFamily="Roboto"
        fontSize={12}
        fontWeight={700}
      >
        Select a component and click the 'Add Component' button
      </Text>
    </AutoLayout>
  </AutoLayout>
);

export const ComponentDocs: FunctionalWidget<ComponentDocsProps> = ({
  usage,
  deleteComponent,
  isChildren,
  isDeleted,
}) => {
  if (!usage) return <EmptyComponentDocs />;
  const { id, name, props, children } = usage;
  const subjects = calculateSubjectsFromProps(props.map(({ value }) => value));
  const [componentIcon, titleTextSize]: [IconProps["icon"], number] = isChildren
    ? ["instance", 14]
    : ["component", 20];

  const childrenToRender = children.filter(({ id }) => !isDeleted(id));
  return (
    <AutoLayout
      name="Component-Frame"
      overflow="visible"
      direction="vertical"
      padding={{
        top: 6,
        right: 3,
        bottom: 6,
        left: 0,
      }}
    >
      <AutoLayout
        name="Component-Header"
        stroke={"#aaa"}
        strokeWidth={1}
        overflow="visible"
        spacing="auto"
        width="fill-parent"
        height={32}
        verticalAlignItems="center"
        strokeDashPattern={[2, 2]}
      >
        <AutoLayout
          name="Title"
          overflow="visible"
          spacing={10}
          verticalAlignItems="center"
        >
          <Icon16px icon={componentIcon} />
          <Text
            name="Component-title"
            fill="#030303"
            fontSize={titleTextSize}
            fontWeight={700}
          >
            {name}
          </Text>
          {isChildren ? (
            <Icon16px icon="close" onClick={() => deleteComponent(id)} />
          ) : (
            <></>
          )}
        </AutoLayout>
        {subjects.length > 0 ? (
          <AutoLayout
            name="Subject-list-group"
            fill="#C6EFC4"
            cornerRadius={6}
            overflow="visible"
            spacing={10}
            padding={{
              vertical: 2,
              horizontal: 4,
            }}
            verticalAlignItems="center"
          >
            <AutoLayout
              name="subject-group"
              spacing={6}
              verticalAlignItems="center"
            >
              <Text
                name="subjects:"
                fill="#000"
                fontFamily="Roboto Mono"
                fontSize={10}
              >
                subjects:
              </Text>
              {subjects.map((subject, idx) => (
                <Pill key={idx}>{subject}</Pill>
              ))}
            </AutoLayout>
          </AutoLayout>
        ) : (
          <></>
        )}
      </AutoLayout>
      <AutoLayout
        name="Component-Content"
        stroke={"#aaa"}
        strokeWidth={1}
        overflow="visible"
        direction="vertical"
        spacing={6}
        padding={{
          top: 6,
          right: 0,
          bottom: 0,
          left: 4,
        }}
        strokeDashPattern={[2, 2]}
      >
        {props.map((prop) => (
          <PropDocs prop={prop} />
        ))}

        {childrenToRender.length > 0 && (
          <AutoLayout name="Children-Component-Group" spacing={6}>
            {childrenToRender.map((subcomponent, key) => (
              <ComponentDocs
                key={key}
                usage={subcomponent}
                isChildren={true}
                deleteComponent={deleteComponent}
                isDeleted={isDeleted}
              />
            ))}
          </AutoLayout>
        )}
      </AutoLayout>
    </AutoLayout>
  );
};
