import { FormatValidationResult, semVerBump } from "radius-toolkit";
import { Icon16px, IconProps } from "./icon";
import { RoundButton } from "./round-button";
import { TokenChangeBar } from "./token-change-bar";
import { VersionBump } from "./version-bump";
import { WarningBadge } from "./warning-badge";
import { colors, typography } from "@repo/bandoneon";
import { LgButton } from "./lg-button";

const { widget } = figma;
const { Frame, Text, AutoLayout, useSyncedState } = widget;

export type PushPanelProps = {
  diff: [string[], string[], string[]];
  issues: [FormatValidationResult[], FormatValidationResult[]];
  previousVersion: string;
  reloadTokens: () => void;
  pushTokens: (branch: string, message: string, version: string) => void;
  openIssues: () => void;
} & BaseProps &
  TextChildren;

export const PushPanel: FunctionalWidget<PushPanelProps> = ({
  children,
  diff,
  issues,
  previousVersion,
  reloadTokens,
  pushTokens,
  openIssues,
  ...props
}) => {
  const [ignoreIssues, setIgnoreIssues] = useSyncedState<boolean>(
    "ignoreIssues",
    false,
  );
  const [manuallyBump, setManuallyBump] = useSyncedState<boolean>(
    "manuallyBump",
    false,
  );
  const [added, modified, deleted] = diff;
  const [addedErrs, modifiedErrs] = issues;

  const newVersion = semVerBump(previousVersion, [
    added.length > 0,
    modified.length > 0,
    deleted.length > 0 || manuallyBump,
  ]);

  const canPush = ignoreIssues || addedErrs.length + modifiedErrs.length === 0;

  return (
    <AutoLayout
      name="TokePublishPage"
      overflow="visible"
      direction="vertical"
      width={"fill-parent"}
      horizontalAlignItems={"center"}
      verticalAlignItems="center"
      spacing={12}
      padding={8}
    >
      <AutoLayout
        name="PublishHeader"
        overflow="visible"
        spacing={"auto"}
        width="fill-parent"
      >
        <Text name="Tokens to publish:" {...typography.buttonLg} fill="#000">
          Changes to publish:
        </Text>
        {deleted.length ? (
          <WarningBadge name="BreakingChangeBadge">
            Breaking Change
          </WarningBadge>
        ) : (
          <Text />
        )}
      </AutoLayout>
      <AutoLayout
        name="PublishSummaryPanel"
        overflow="visible"
        direction="vertical"
        width="fill-parent"
        spacing={16}
      >
        <AutoLayout overflow="visible" direction="vertical" width="fill-parent">
          <TokenChangeBar
            name="NewTokens"
            changeType="new"
            variant="start"
            tokensChanged={added}
            issues={addedErrs}
            openIssues={openIssues}
          />
          <TokenChangeBar
            name="ModifiedTokens"
            changeType="modified"
            variant="default"
            tokensChanged={modified}
            issues={modifiedErrs}
            openIssues={openIssues}
          />
          <TokenChangeBar
            name="DeletedTokens"
            changeType="deleted"
            variant="end"
            tokensChanged={deleted}
            openIssues={openIssues}
            issues={[]}
          />
        </AutoLayout>
      </AutoLayout>
      <AutoLayout spacing={8} direction="vertical">
        <CheckBox
          label="Ignore issues and publish anyway"
          checked={ignoreIssues}
          setChecked={setIgnoreIssues}
        />
        {deleted.length === 0 && (
          <CheckBox
            label="Manually bump version"
            checked={manuallyBump}
            setChecked={setManuallyBump}
          />
        )}
      </AutoLayout>
      <AutoLayout padding={8} horizontalAlignItems={"center"}>
        <VersionBump from={previousVersion} to={newVersion} />
      </AutoLayout>
      <AutoLayout
        name="PublishActionPanel"
        overflow="visible"
        direction="vertical"
        spacing={16}
        minWidth={320}
        verticalAlignItems="end"
        horizontalAlignItems="center"
        {...props}
      >
        <AutoLayout
          name="PublishActions"
          overflow="visible"
          spacing={8}
          horizontalAlignItems="center"
          verticalAlignItems="end"
        >
          <LgButton
            label="Push to Github"
            name="PushToGithubButton"
            icon="github"
            variant={canPush ? "success" : "disabled"}
            onClick={
              canPush
                ? () =>
                    pushTokens(
                      ...createCommitDetails(
                        newVersion,
                        deleted,
                        added,
                        modified,
                        manuallyBump,
                      ),
                    )
                : undefined
            }
          ></LgButton>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
};

export type CheckBoxProps = {
  label: string;
  checked: boolean;
  setChecked: (checked: boolean) => void;
} & BaseProps;

export const CheckBox: FunctionalWidget<CheckBoxProps> = ({
  label,
  checked,
  setChecked,
  ...props
}) => {
  return (
    <AutoLayout
      name="CheckBox"
      overflow="visible"
      spacing={8}
      verticalAlignItems="center"
      onClick={() => setChecked(!checked)}
      {...props}
    >
      <Frame
        name="Checkbox"
        fill={checked ? colors.active.bg : colors.white}
        stroke={colors.black}
        cornerRadius={4}
        overflow="visible"
        width={20}
        height={20}
        onClick={() => setChecked(!checked)}
      >
        {checked ? (
          <Icon16px
            name="check_24px"
            icon="check"
            positioning="auto"
            color={colors.white}
          />
        ) : (
          <></>
        )}
      </Frame>
      <Text name={label} {...typography.small} fill={colors.black}>
        {label}
      </Text>
    </AutoLayout>
  );
};

function createCommitDetails(
  newVersion: string,
  deleted: string[],
  added: string[],
  modified: string[],
  forceBreaking: boolean = false,
): [string, string, string] {
  const breaking = forceBreaking || deleted.length > 0;
  return [
    `design/${newVersion}`,
    `${
      breaking ? "feat(design-tokens)" : "fix(design-tokens)"
    }: Changes to Design Tokens

${added.length > 0 ? "Added tokens:" : ""}
${added.map((t) => "+ " + t).join("\n")}

${deleted.length > 0 ? "Deleted tokens:" : ""}
${deleted.map((t) => "- " + t).join("\n")}

${modified.length > 0 ? "Modified tokens:" : ""}
${modified.map((t) => ". " + t).join("\n")}

# Figma User: ${figma.currentUser?.name}
  `,
    newVersion,
  ];
}
