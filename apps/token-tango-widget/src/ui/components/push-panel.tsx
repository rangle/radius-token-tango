import { semVerBump } from "../../common/layer-diff.utils";
import { FormatValidationResult } from "radius-toolkit";
import { Icon16px, IconProps } from "./icon";
import { RoundButton } from "./round-button";
import { TokenChangeBar } from "./token-change-bar";
import { VersionBump } from "./version-bump";
import { WarningBadge } from "./warning-badge";

const { widget } = figma;
const { Frame, Text, AutoLayout, useSyncedState } = widget;

export type PushPanelProps = {
  diff: [string[], string[], string[]];
  errors: [FormatValidationResult[], FormatValidationResult[]];
  previousVersion: string;
  reloadTokens: () => void;
  pushTokens: (branch: string, message: string, version: string) => void;
} & BaseProps &
  TextChildren;

export const PushPanel: FunctionalWidget<PushPanelProps> = ({
  children,
  diff,
  errors,
  previousVersion,
  reloadTokens,
  pushTokens,
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
  const [addedErrs, modifiedErrs] = errors;

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
      width={"hug-contents"}
      spacing={12}
      padding={10}
    >
      <AutoLayout
        name="PublishHeader"
        overflow="visible"
        spacing={"auto"}
        width="fill-parent"
      >
        <Text
          name="Tokens to publish:"
          fill="#000"
          lineHeight="100%"
          fontFamily="Inter"
          fontWeight={500}
        >
          Tokens to publish:
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
      >
        <TokenChangeBar
          name="NewTokens"
          changeType="new"
          variant="start"
          tokensChanged={added}
          issues={addedErrs}
        />
        <TokenChangeBar
          name="ModifiedTokens"
          changeType="modified"
          variant="default"
          tokensChanged={modified}
          issues={modifiedErrs}
        />
        <TokenChangeBar
          name="DeletedTokens"
          changeType="deleted"
          variant="end"
          tokensChanged={deleted}
          issues={[]}
        />
      </AutoLayout>
      <AutoLayout
        name="IgnoreIssuesCheck"
        overflow="visible"
        spacing={8}
        verticalAlignItems="center"
      >
        <Frame
          name="Checkbox"
          fill="#FFF"
          stroke="#808080"
          cornerRadius={4}
          overflow="visible"
          width={20}
          height={20}
          onClick={() => setIgnoreIssues(!ignoreIssues)}
        >
          {ignoreIssues ? (
            <Icon16px name="check_24px" icon="check" positioning="auto" />
          ) : (
            <></>
          )}
        </Frame>
        <Text
          name="Ignore issues and publish anyway"
          fill="#767676"
          lineHeight="140%"
          fontFamily="Inter"
          fontSize={12}
          letterSpacing={0.24}
        >
          Ignore issues and publish anyway
        </Text>
      </AutoLayout>
      {deleted.length === 0 && (
        <AutoLayout
          name="manuallyBumpCheck"
          overflow="visible"
          spacing={8}
          verticalAlignItems="center"
        >
          <Frame
            name="Checkbox"
            fill="#FFF"
            stroke="#808080"
            cornerRadius={4}
            overflow="visible"
            width={18}
            height={18}
            onClick={() => setManuallyBump(!manuallyBump)}
          >
            {manuallyBump ? (
              <Icon16px name="check_24px" icon="check" positioning="auto" />
            ) : (
              <></>
            )}
          </Frame>

          <Text
            name="Manually bumb version"
            fill="#767676"
            lineHeight="140%"
            fontFamily="Inter"
            fontSize={12}
            letterSpacing={0.24}
          >
            Manually bump version
          </Text>
        </AutoLayout>
      )}
      <AutoLayout padding={8}>
        <VersionBump from={previousVersion} to={newVersion} />
      </AutoLayout>
      <AutoLayout
        name="PublishActionPanel"
        overflow="visible"
        direction="vertical"
        spacing={16}
        padding={8}
        minWidth={320}
        verticalAlignItems="end"
        horizontalAlignItems="center"
        {...props}
      >
        <AutoLayout
          name="PublishActions"
          overflow="visible"
          spacing={8}
          minWidth={264}
          verticalAlignItems="end"
        >
          <RoundButton
            name="CheckAgainButton"
            icon="refresh"
            onClick={() => reloadTokens()}
          >
            Check again
          </RoundButton>
          <RoundButton
            name="PushToGithubButton"
            icon="git"
            variant={canPush ? "default" : "disabled"}
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
          >
            Push to Github
          </RoundButton>
        </AutoLayout>
      </AutoLayout>
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
