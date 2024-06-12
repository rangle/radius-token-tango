const { widget } = figma;
const { AutoLayout, Text, SVG, Frame } = widget;

import { WidgetHeader } from "../components/widget-header";
import { BottomLogo } from "../components/bottom-logo";
import { Button } from "../components/button";
import { Icon16px } from "../components/icon";
import { RepositoryTokenLayers } from "../../services/load-github.services";
import { CommitRibbon } from "../components/commit-ribbon";
import { RepositoryRibbon } from "../components/repository-ribbon";

type PageLayoutProps = {
  synched: boolean;
  name: string;
  error: string | null;
  synchDetails: RepositoryTokenLayers | null;
  appVersion: string;
  openConfig: () => void;
  synchronize?: () => void;
  loadVariables?: () => void;
} & HasChildrenProps;

export const PageLayout = ({
  synched,
  name,
  error,
  appVersion,
  synchDetails,
  openConfig,
  children,
}: PageLayoutProps) => {
  const synchMetadata = synchDetails && synchDetails[2];

  return (
    <AutoLayout
      name="WidgetFrame"
      effect={{
        type: "drop-shadow",
        color: "#00000040",
        offset: {
          x: 0,
          y: 4,
        },
        blur: 4,
        showShadowBehindNode: false,
      }}
      fill="#F6F6F6"
      stroke="#858585"
      cornerRadius={6}
      direction="vertical"
      spacing={16}
      padding={24}
    >
      <WidgetHeader>
        <AutoLayout
          name="Header"
          strokeWidth={1.157}
          overflow="visible"
          direction="vertical"
          spacing={17}
          verticalAlignItems="center"
          horizontalAlignItems="center"
        >
          <AutoLayout
            name="Frame 1000002077"
            overflow="visible"
            direction="vertical"
            spacing={8}
            verticalAlignItems="center"
            horizontalAlignItems="center"
          >
            <SVG
              name="Union"
              height={35}
              width={23}
              src="<svg width='25' height='35' viewBox='0 0 25 35' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path fill-rule='evenodd' clip-rule='evenodd' d='M21.7253 6.4635V18.4332L19.2433 17L14.3079 19.85V25.5474L19.2433 28.3986L24.1787 25.5474V19.85L24.0855 19.7961V2.99704L24.0855 2.80797e-05L24.0855 4.5611e-05V0L21.7253 1.34865V1.35586L8.24626 9.09914L8.23885 9.10337V13.2135L8.23885 14.498L8.23885 25.0346L5.75673 23.6013L0.821289 26.4513V32.1487L5.75673 34.9999L10.6922 32.1487V26.4513L10.599 26.3975V13.0919L21.7253 6.4635Z' fill='#262626'/>
</svg>
"
            />
            <Frame
              name="token tango"
              strokeWidth={0}
              overflow="visible"
              width={184.987}
              height={27.52}
            >
              <SVG
                name="Vector_Vector_Vector_Vector_Vector_Vector_Vector_Vector_Vector_Vector"
                height={28}
                width={185}
                src="<svg width='185' height='28' viewBox='0 0 185 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M172.079 13.5294C172.079 16.1431 173.401 18.9105 176.63 18.9105C179.858 18.9105 181.181 16.1431 181.181 13.5294C181.181 10.9158 179.858 8.14837 176.63 8.14837C173.401 8.14837 172.079 10.9158 172.079 13.5294ZM184.994 13.5294C184.994 18.2955 181.703 21.9854 176.63 21.9854C171.556 21.9854 168.266 18.2955 168.266 13.5294C168.266 8.76335 171.556 5.07349 176.63 5.07349C181.703 5.07349 184.994 8.76335 184.994 13.5294Z' fill='black'/>
<path d='M160.827 13.0682C160.827 10.147 159.044 8.14837 156.43 8.14837C153.97 8.14837 152.187 10.147 152.187 13.0682C152.187 15.9893 153.97 17.988 156.43 17.988C159.044 17.988 160.827 15.9893 160.827 13.0682ZM155.815 21.0629C151.356 21.0629 148.374 17.5268 148.374 13.0682C148.374 8.60961 151.356 5.07349 155.815 5.07349C158.429 5.07349 160.058 6.45719 160.673 7.22591V5.53472H164.486V19.6792C164.486 24.7528 161.042 27.5202 156.584 27.5202C152.74 27.5202 150.065 25.829 149.45 22.7541H153.355C153.847 24.1378 154.893 24.599 156.584 24.599C159.197 24.599 160.673 22.9078 160.673 19.6792V18.9105C160.058 19.6792 158.429 21.0629 155.815 21.0629Z' fill='black'/>
<path d='M133.486 5.53472V7.5334C134.562 5.99595 136.346 5.07349 138.498 5.07349C142.342 5.07349 144.71 7.37965 144.71 11.5307V21.5241H140.897V11.8382C140.897 9.53207 139.882 8.30212 137.576 8.30212C135.27 8.30212 133.486 9.83956 133.486 12.7607V21.5241H129.673V5.53472H133.486Z' fill='black'/>
<path d='M114.76 9.83956H110.824C111.316 6.94917 113.745 5.07349 117.958 5.07349C120.571 5.07349 122.693 5.78071 123.892 7.19516C124.692 8.11762 125.091 9.37833 125.091 10.9158V21.5241H121.279V19.6792C120.356 20.9092 118.88 21.9854 115.959 21.9854C112.73 21.9854 110.055 20.2942 110.055 16.7581C110.055 13.6832 112.423 12.0227 116.113 11.6845L121.279 11.2233V10.9158C121.279 9.07084 120.418 7.99463 117.958 7.99463C115.959 7.99463 115.006 8.6711 114.76 9.83956ZM116.574 19.0642C119.188 19.0642 121.279 17.5268 121.279 14.6056V13.9907L116.266 14.4519C114.852 14.5749 113.868 15.3744 113.868 16.7581C113.868 18.2955 114.975 19.0642 116.574 19.0642Z' fill='black'/>
<path d='M99.5167 17.2192V8.60948H95.6731V5.53459H99.5167V1.84473H103.33V5.53459H107.634V8.60948H103.33V17.2192C103.33 18.1416 103.637 18.5414 104.56 18.5414H107.634V21.524H103.637C100.716 21.524 99.5167 20.1403 99.5167 17.2192Z' fill='black'/>
<path d='M74.5131 5.53472V7.5334C75.5893 5.99595 77.3727 5.07349 79.5251 5.07349C83.3687 5.07349 85.7364 7.37965 85.7364 11.5307V21.5241H81.9235V11.8382C81.9235 9.53207 80.9088 8.30212 78.6027 8.30212C76.2965 8.30212 74.5131 9.83956 74.5131 12.7607V21.5241H70.7002V5.53472H74.5131Z' fill='black'/>
<path d='M62.5339 16.9118H66.6542C65.7625 19.6792 63.1488 21.9854 58.9978 21.9854C53.8934 21.9854 50.6956 18.2955 50.6956 13.5294C50.6956 8.76335 53.9857 5.07349 58.9055 5.07349C62.9644 5.07349 65.4243 7.22591 66.439 10.4238C66.808 11.5922 66.9617 12.9452 66.9617 14.2981V14.9131H54.6622C54.7852 16.9118 56.2304 19.0642 58.9978 19.0642C61.0887 19.0642 62.1649 17.8958 62.5339 16.9118ZM58.9055 7.99463C56.4456 7.99463 54.9082 9.83956 54.6622 11.992H62.9951C62.9029 9.83956 61.4577 7.99463 58.9055 7.99463Z' fill='black'/>
<path d='M38.6905 14.7287V21.5242H34.8777V0H38.6905V11.8691L44.8711 5.53479H49.7601L42.0729 13.222L50.3751 21.5242H45.1786L38.6905 14.7287Z' fill='black'/>
<path d='M18.1749 13.5294C18.1749 16.1431 19.4971 18.9105 22.7258 18.9105C25.9544 18.9105 27.2766 16.1431 27.2766 13.5294C27.2766 10.9158 25.9544 8.14837 22.7258 8.14837C19.4971 8.14837 18.1749 10.9158 18.1749 13.5294ZM31.0894 13.5294C31.0894 18.2955 27.7993 21.9854 22.7258 21.9854C17.6522 21.9854 14.3621 18.2955 14.3621 13.5294C14.3621 8.76335 17.6522 5.07349 22.7258 5.07349C27.7993 5.07349 31.0894 8.76335 31.0894 13.5294Z' fill='black'/>
<path d='M3.85044 17.2192V8.60948H0.00683594V5.53459H3.85044V1.84473H7.6633V5.53459H11.9681V8.60948H7.6633V17.2192C7.6633 18.1416 7.97079 18.5414 8.89326 18.5414H11.9681V21.524H7.97079C5.04965 21.524 3.85044 20.1403 3.85044 17.2192Z' fill='black'/>
</svg>
"
              />
            </Frame>
          </AutoLayout>
          <Text
            name="Want to export your Figma Variables as Tokens? No problem! Validate naming conventions and export directly to Github."
            fill="#696969"
            width={421}
            verticalAlignText="center"
            horizontalAlignText="center"
            lineHeight="130%"
            fontFamily="Inter"
            fontSize={14}
            fontWeight={700}
          >
            Want to export your Figma Variables as Tokens? No problem! Validate
            naming conventions and export directly to Github.
          </Text>
        </AutoLayout>
      </WidgetHeader>
      {error && (
        <AutoLayout
          cornerRadius={6}
          padding={6}
          spacing={6}
          direction="vertical"
          fill="#fff"
        >
          <Text fontSize={12} fill={"#ff0000"}>
            {error}
          </Text>
        </AutoLayout>
      )}
      {synchMetadata && (
        <RepositoryRibbon
          name={synchMetadata.name}
          avatarUrl={synchMetadata.lastCommits?.[0].autor_avatar_url}
          commitMessage={synchMetadata.lastCommits?.[0].message}
          dateTime={synchMetadata.lastCommits?.[0].author.date}
          userName={synchMetadata.lastCommits?.[0].author.name}
          version={synchMetadata.version}
          openConfig={openConfig}
          status={synched ? "online" : "disconnected"}
        />
      )}
      <AutoLayout
        cornerRadius={12}
        padding={16}
        spacing={16}
        direction="vertical"
        horizontalAlignItems="center"
        fill="#fff"
        width="fill-parent"
      >
        {children}
      </AutoLayout>
      <AutoLayout direction="horizontal" padding={16} width={"hug-contents"}>
        <BottomLogo version={appVersion} />
      </AutoLayout>
    </AutoLayout>
  );
};
