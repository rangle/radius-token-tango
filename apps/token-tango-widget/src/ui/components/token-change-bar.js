import { BulletLabel } from "./bullet-label.js";
import { ErrorPill } from "./error-pill.js";
import { Icon16px } from "./icon.js";
import { VariableBullet } from "./variable-bullet.js";
const { widget } = figma;
const { Text, AutoLayout, useSyncedState } = widget;
const propMap = {
    new: { color: "green", text: "New" },
    modified: { color: "amber", text: "Modified" },
    deleted: { color: "red", text: "Deleted" },
};
const cornerRadii = {
    default: {
        topLeft: 0,
        topRight: 0,
        bottomRight: 0,
        bottomLeft: 0,
    },
    start: {
        topLeft: 8,
        topRight: 8,
        bottomRight: 0,
        bottomLeft: 0,
    },
    end: {
        topLeft: 0,
        topRight: 0,
        bottomRight: 8,
        bottomLeft: 8,
    },
};
export const TokenChangeBar = ({ changeType, variant = "default", tokensChanged, issues, children, ...props }) => {
    const [open, setOpen] = useSyncedState(`${changeType}BarOpen`, false);
    const { color, text } = propMap[changeType];
    return (<AutoLayout name="TokenChangeBar" overflow="visible" direction="vertical" minWidth={276} width={"fill-parent"} {...props}>
      <AutoLayout name="AccordionItem" fill="#FFF" stroke="#E3E3E3" strokeAlign="outside" overflow="visible" spacing="auto" padding={10} width="fill-parent" verticalAlignItems="center" cornerRadius={variant === "end" && open ? undefined : cornerRadii[variant]}>
        <BulletLabel color={color}>
          {tokensChanged.length} {text}
        </BulletLabel>
        <AutoLayout name="AccordionHandle" overflow="visible" spacing={4} horizontalAlignItems="end" verticalAlignItems="center" onClick={tokensChanged.length > 0 ? () => setOpen(!open) : undefined}>
          {issues.length > 0 ? (<ErrorPill name="IssueBadge">{issues.length} issues</ErrorPill>) : (<></>)}
          <Icon16px name="expand_more" icon={open ? "chevron-up" : "chevron-down"} color={tokensChanged.length > 0 ? "#000" : "#bbb"}/>
        </AutoLayout>
      </AutoLayout>
      {open ? (<AutoLayout fill="#FFF" stroke="#E3E3E3" strokeAlign="outside" overflow="visible" spacing="auto" padding={10} direction="vertical" width="fill-parent">
          {tokensChanged.map((token) => (<VariableBullet name={token} width={"fill-parent"} issues={issues
                    .filter(({ variable }) => variable.name.replaceAll("/", ".") === token)
                    .flatMap(({ errors }) => errors)}/>))}
        </AutoLayout>) : (<></>)}
    </AutoLayout>);
};
