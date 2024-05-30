const { widget } = figma;
const { Text, AutoLayout } = widget;
import { TokenUse } from "../common/token.types.js";
import { TokenError, validateTokenName } from "../common/token.utils.js";
import { Icon16px } from "../ui/components/icon.js";

export type PropUsage = {
  prop: TokenUse;
};
export const PropDocs: FunctionalWidget<PropUsage> = ({ prop }) => {
  return (
    <>
      <AutoLayout name="Component-prop" spacing={6} verticalAlignItems="center">
        <Text
          name="prop-name"
          fill="#000"
          fontFamily="Roboto Mono"
          fontSize={12}
        >
          {prop.name}:
        </Text>
        <PropValue type={prop.from} value={prop.value} />
      </AutoLayout>
    </>
  );
};

export type PropValueType = {
  type: "variable" | "token studio";
  value: string;
};

const htmlRenderError = (err: TokenError) =>
  `<div><b style="color: red">${err.title}</b><br/><i>${err.message}</i><div>`;
const htmlRenderErrorList = (errs: TokenError[]) =>
  `<div style="width: auto; height: auto"><div style="padding: 0.5rem">${errs.map(
    htmlRenderError,
  )}</div></div>`;

const showErrors = async (
  errors: Record<string, TokenError[]> | TokenError[],
) => {
  const errorsRendered = Array.isArray(errors)
    ? htmlRenderErrorList(errors)
    : Object.entries(errors)
        .map(
          ([segment, errors]) =>
            `<h2>${segment}</h2>${htmlRenderErrorList(errors)}`,
        )
        .join("\n");

  await new Promise((_resolve) =>
    figma.showUI(errorsRendered, {
      visible: true,
    }),
  );
};

const RedSgmt: FunctionalWidget<TextProps & { onClick: () => void }> = ({
  children,
  onClick,
}) => (
  <Text
    name="red-text-segment"
    fill="#F00"
    fontFamily="Roboto Mono"
    fontSize={12}
    fontWeight={700}
    onClick={() => onClick()}
  >
    {children}
  </Text>
);

const Sgmt: FunctionalWidget<TextProps> = ({ children }) => (
  <Text name="text-segment" fill="#000" fontFamily="Roboto Mono" fontSize={12}>
    {children}
  </Text>
);

function renderName(
  printableName: string,
  errorsBySegment: Record<string, TokenError[]>,
  ok: boolean,
) {
  const segments = printableName.split(".");
  // TODO: inject render function from the outside to be able to create a nicer floating hint
  const renderedName = ok ? (
    <Sgmt>{printableName}</Sgmt>
  ) : (
    segments.flatMap((segment, index) => [
      errorsBySegment[segment] ? (
        <RedSgmt onClick={() => showErrors(errorsBySegment[segment])}>
          {segment}
        </RedSgmt>
      ) : (
        <Sgmt>{segment}</Sgmt>
      ),
      <Sgmt>{index < segments.length - 1 ? "." : ""}</Sgmt>,
    ])
  );
  return renderedName;
}

export const PropValue: FunctionalWidget<PropValueType> = ({ type, value }) => {
  const [name, valid, errors, errorsBySegment] = validateTokenName(value);
  return (
    <>
      <AutoLayout
        name="PropValue"
        fill={valid ? "#C4D8F3" : "#F2C94C73"}
        cornerRadius={6}
        overflow="visible"
        padding={{
          top: 0,
          right: 0,
          bottom: 0,
          left: 2,
        }}
        onClick={() => showErrors(errors)}
        verticalAlignItems="center"
      >
        <Icon16px icon={type === "variable" ? "variables" : "tokens"} />

        <AutoLayout
          name="PropertyValue"
          fill="#D3E6FF"
          cornerRadius={{
            topLeft: 0,
            topRight: 6,
            bottomRight: 6,
            bottomLeft: 0,
          }}
          overflow="visible"
          spacing={0}
          padding={4}
          verticalAlignItems="center"
        >
          {renderName(name, errorsBySegment, valid)}
        </AutoLayout>
      </AutoLayout>
    </>
  );
};
