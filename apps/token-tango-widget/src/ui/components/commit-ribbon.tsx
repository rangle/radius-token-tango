import { Icon16px } from "./icon.js";
const { widget } = figma;
const { Text, AutoLayout, Image, useSyncedState } = widget;

export type CommitRibbonProps = BaseProps & {
  name: string;
  avatarUrl: string;
  userName: string;
  commitMessage: string;
  version: string;
  dateTime: string;
};

export const CommitRibbon: FunctionalWidget<CommitRibbonProps> = ({
  name,
  avatarUrl,
  userName,
  commitMessage,
  version,
  dateTime,
  ...props
}) => {
  const [openCommitMessage, setOpenCommitMessage] = useSyncedState<boolean>(
    "openCommitMessage",
    false,
  );

  const [wasTruncated, messageToShow] = truncateCommitMessage(commitMessage);

  return (
    <AutoLayout
      name="CommitDetailsStateDefault"
      fill="#333"
      direction="vertical"
      spacing={8}
      padding={8}
      width={"fill-parent"}
      horizontalAlignItems="center"
      {...props}
    >
      <AutoLayout
        name="AuthorHeader"
        overflow="visible"
        direction="vertical"
        spacing={8}
        width={"fill-parent"}
      >
        <AutoLayout
          name="Frame 1000002107"
          overflow="visible"
          spacing="auto"
          width="fill-parent"
        >
          <AutoLayout
            name="User"
            overflow="visible"
            spacing={6}
            horizontalAlignItems="center"
            verticalAlignItems="center"
          >
            <Image name="Rectangle" width={16} height={16} src={avatarUrl} />
            <Text
              name="user"
              fill="#E6EDF3"
              fontFamily="Roboto Mono"
              fontSize={10}
            >
              {userName}
            </Text>
          </AutoLayout>
          <Text
            name="date"
            fill="#DADADA"
            fontFamily="Roboto Mono"
            fontSize={9}
          >
            {dateTime}
          </Text>
        </AutoLayout>
      </AutoLayout>
      <AutoLayout
        name="CommitMessageShort"
        overflow="visible"
        spacing={6}
        width={"fill-parent"}
        height={"hug-contents"}
        horizontalAlignItems="center"
        verticalAlignItems="center"
        onClick={() => setOpenCommitMessage(!openCommitMessage)}
      >
        {openCommitMessage ? (
          <Text
            name="message-open"
            fill="#DADADA"
            width="fill-parent"
            fontFamily="Roboto Mono"
            fontSize={9}
            height={"fill-parent"}
            truncate={false}
          >
            {messageToShow}
          </Text>
        ) : (
          <Text
            name="message-closed"
            fill="#DADADA"
            width="fill-parent"
            fontFamily="Roboto Mono"
            fontSize={9}
            height={12}
            truncate={true}
          >
            {messageToShow}
          </Text>
        )}
        <Icon16px
          icon={openCommitMessage ? "chevron-up" : "chevron-down"}
          color="#fff"
        />
      </AutoLayout>
    </AutoLayout>
  );
};

const MAX_MESSAGE_LINES = 35;
const MAX_MESSAGE_LENGTH = 1000;

function truncateCommitMessage(commitMessage: string) {
  const lines = commitMessage.split("\n");
  if (lines.length > MAX_MESSAGE_LINES) {
    return [true, lines.slice(0, MAX_MESSAGE_LINES).join("\n")] as const;
  }
  if (commitMessage.length > MAX_MESSAGE_LENGTH) {
    return [true, commitMessage.slice(0, MAX_MESSAGE_LENGTH)] as const;
  }
  return [false, commitMessage] as const;
}
