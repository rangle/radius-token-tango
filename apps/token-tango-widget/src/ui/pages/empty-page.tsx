const { widget } = figma;
const { AutoLayout, Text, Frame, SVG } = widget;

import { URL_ACCESS_TOKEN_DOCS } from "../../constants";
import { NameFormat } from "../components/name-format";
import { MessageRibbon } from "../components/message-ribbon";
import { RefreshedContent } from "../components/refreshed-content";
import { WidgetConfiguration } from "@repo/config";

type EmptyPageProps = {
  synchConfig: WidgetConfiguration | null;
  loadTokens: () => void;
  openConfig: () => void;
};

export const EmptyPage = ({
  synchConfig,
  loadTokens,
  openConfig,
}: EmptyPageProps) => {
  return (
    <AutoLayout
      cornerRadius={12}
      padding={16}
      spacing={16}
      direction="vertical"
      horizontalAlignItems={"center"}
      fill="#fff"
      width="fill-parent"
    >
      <NameFormat />
      {synchConfig ? (
        <RefreshedContent
          name={synchConfig.name}
          status={synchConfig.status || "disconnected"}
          loadTokens={loadTokens}
          openConfig={openConfig}
        />
      ) : (
        <AutoLayout
          name="Frame"
          direction="vertical"
          spacing={16}
          width={406}
          verticalAlignItems="center"
          horizontalAlignItems="center"
        >
          <AutoLayout
            name="Frame 1000002080"
            overflow="visible"
            direction="vertical"
            spacing={16}
            verticalAlignItems="end"
            horizontalAlignItems="center"
          >
            <AutoLayout
              name="Frame 1000002080"
              overflow="visible"
              direction="vertical"
              spacing={4}
              verticalAlignItems="center"
              horizontalAlignItems="center"
            >
              <AutoLayout
                name="Frame 1000002083"
                strokeWidth={1.474}
                overflow="visible"
                spacing={14.735}
                horizontalAlignItems="center"
                verticalAlignItems="center"
              >
                <SVG
                  name="Vector"
                  height={22}
                  width={22}
                  src="<svg width='24' height='23' viewBox='0 0 24 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M12.0001 0.52002C5.89793 0.52002 0.94873 5.5934 0.94873 11.8509C0.94873 16.8572 4.11495 21.1043 8.50698 22.6029C9.05864 22.7078 9.23729 22.3565 9.23729 22.0581V19.9486C6.16316 20.6342 5.5231 18.6117 5.5231 18.6117C5.02025 17.3019 4.29546 16.9535 4.29546 16.9535C3.29255 16.2501 4.3719 16.2652 4.3719 16.2652C5.48166 16.3445 6.06554 17.4333 6.06554 17.4333C7.05095 19.165 8.65064 18.6645 9.2815 18.3747C9.38003 17.6428 9.66645 17.1424 9.98326 16.8601C7.52893 16.5721 4.94842 15.6004 4.94842 11.2598C4.94842 10.0219 5.38035 9.01155 6.08672 8.2184C5.97252 7.93229 5.59402 6.77937 6.19447 5.21949C6.19447 5.21949 7.12279 4.91545 9.23454 6.38091C10.1159 6.12974 11.0608 6.00415 12.0001 5.99942C12.9395 6.00415 13.8853 6.12974 14.7685 6.38091C16.8784 4.91545 17.8049 5.21949 17.8049 5.21949C18.4064 6.78031 18.0277 7.93323 17.9135 8.2184C18.6227 9.01155 19.0509 10.0228 19.0509 11.2598C19.0509 15.6118 16.4658 16.5702 14.0051 16.8506C14.4011 17.2019 14.763 17.8912 14.763 18.9488V22.0581C14.763 22.3593 14.9398 22.7134 15.5007 22.6019C19.889 21.1015 23.0516 16.8553 23.0516 11.8509C23.0516 5.5934 18.1033 0.52002 12.0001 0.52002Z' fill='#262626'/>
        </svg>
        "
                />
              </AutoLayout>
              <Text
                name="Connect Github to continue"
                fill="#262626"
                verticalAlignText="center"
                horizontalAlignText="center"
                lineHeight="150%"
                fontFamily="Inter"
                fontSize={20}
                fontWeight={700}
                textDecoration="underline"
                onClick={openConfig}
              >
                Connect Github to continue
              </Text>
              <Text
                name="Github Access Token"
                fill="#262626"
                verticalAlignText="center"
                horizontalAlignText="center"
                lineHeight="150%"
                fontFamily="Inter"
                fontSize={13}
              >
                You will need a Github Access Token.
              </Text>
              <AutoLayout spacing={6}>
                <Text
                  name="Github Access Token"
                  fill="#262626"
                  verticalAlignText="center"
                  horizontalAlignText="center"
                  lineHeight="150%"
                  fontFamily="Inter"
                  fontSize={13}
                >
                  Find out how to obtain one
                </Text>
                <Text
                  name="Github Access Token"
                  fill="#0000ff"
                  verticalAlignText="center"
                  horizontalAlignText="center"
                  lineHeight="150%"
                  fontFamily="Inter"
                  fontSize={13}
                  textDecoration="underline"
                  onClick={() => figma.openExternal(URL_ACCESS_TOKEN_DOCS)}
                >
                  here
                </Text>
              </AutoLayout>
            </AutoLayout>
            <AutoLayout
              name="Frame 1000002007"
              fill="#E7E7E7"
              cornerRadius={69}
              overflow="visible"
              spacing={8}
              padding={{
                vertical: 8,
                horizontal: 24,
              }}
              height={37}
              horizontalAlignItems="center"
              verticalAlignItems="center"
            >
              <AutoLayout
                name="Frame 1000002032"
                overflow="visible"
                spacing={8}
                verticalAlignItems="center"
              >
                <Text
                  name="Button Label"
                  fill="#808080"
                  verticalAlignText="center"
                  horizontalAlignText="center"
                  lineHeight="150%"
                  fontFamily="Inter"
                  fontSize={14}
                  fontWeight={700}
                >
                  Let's load your tokens
                </Text>
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      )}
    </AutoLayout>
  );
};
