const { widget } = figma;
const { Text, AutoLayout, Frame, SVG } = widget;
export const WidgetHeader = ({ children, ...props }) => {
    return (<AutoLayout name="WidgetHeader" overflow="visible" direction="vertical" spacing="auto" width={"fill-parent"}>
      <AutoLayout name="Frame" padding={{
            vertical: 6,
            horizontal: 3,
        }} width="fill-parent">
        <AutoLayout name="Widget-title" spacing={6}>
          <AutoLayout name="static-icon-button" overflow="visible" padding={2}>
            <Frame name="Icon" strokeWidth={1.333} width={16} height={16}>
              <Frame name="icon/radius" width={16} height={16}>
                <SVG name="Vector_Vector" height={16} width={16} src="<svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path d='M6 6L14 14' stroke='#D44527' stroke-width='2' stroke-miterlimit='10'/>
    <path d='M4.29646 14.6029H1.3335C1.34262 11.0695 2.75031 7.68333 5.24882 5.18485C7.7473 2.68634 11.1334 1.27865 14.6668 1.26953V4.25719C11.9207 4.25718 9.2867 5.34638 7.34256 7.28586C5.39848 9.22533 4.303 11.8567 4.29646 14.6029Z' fill='#262626'/>
    </svg>
    "/>
              </Frame>
            </Frame>
          </AutoLayout>
          <Text name="Radius Token Inspector" fill="#030303" fontFamily="Inter" fontWeight={700}>
            Radius
          </Text>
        </AutoLayout>
      </AutoLayout>
      <AutoLayout name="HeaderChildren" overflow="visible" direction="vertical" spacing={17} width="fill-parent" verticalAlignItems="center" horizontalAlignItems="center">
        <AutoLayout name="Header" strokeWidth={1.157} overflow="visible" direction="vertical" spacing={17} width="fill-parent" maxWidth={470} verticalAlignItems="center" horizontalAlignItems="center">
          <AutoLayout name="Frame 1000002078" overflow="visible" direction="vertical" spacing={8} width="fill-parent" verticalAlignItems="center" horizontalAlignItems="center">
            <Frame name="Union" width={23} height={35}>
              <SVG name="Vector" x={{
            type: "horizontal-scale",
            leftOffsetPercent: 2.174,
            rightOffsetPercent: 2.174,
        }} y={{
            type: "vertical-scale",
            topOffsetPercent: 14.286,
            bottomOffsetPercent: 0,
        }} height={30} width={22} src="<svg width='22' height='30' viewBox='0 0 22 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path fill-rule='evenodd' clip-rule='evenodd' d='M19.6892 5.54016V15.7999L17.3514 14.5715L12.7028 17.0143V21.8978L17.3514 24.3417L22 21.8978V17.0143L21.9122 16.9681V2.5689V2.40684e-05L19.6892 1.15599V1.16217L6.99347 7.79929L6.98649 7.80291V11.3259V12.4269V21.4583L4.64862 20.2297L0 22.6726V27.5561L4.64862 30L9.29727 27.5561V22.6726L9.20948 22.6265V11.2217L19.6892 5.54016Z' fill='#262626'/>
    </svg>
    "/>
            </Frame>
            <Frame name="token tango" strokeWidth={0} overflow="visible" width={184.987} height={27.52}>
              <Frame name="Vector_Vector_Vector_Vector_Vector_Vector_Vector_Vector_Vector_Vector" width={185} height={28}>
                <SVG name="Vector_Vector_Vector_Vector_Vector_Vector_Vector_Vector_Vector_Vector" height={28} width={185} src="<svg width='186' height='28' viewBox='0 0 186 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g clip-path='url(#clip0_532_1319)'>
    <path d='M172.585 13.5294C172.585 16.1431 173.907 18.9105 177.136 18.9105C180.364 18.9105 181.687 16.1431 181.687 13.5294C181.687 10.9158 180.364 8.14837 177.136 8.14837C173.907 8.14837 172.585 10.9158 172.585 13.5294ZM185.5 13.5294C185.5 18.2955 182.209 21.9854 177.136 21.9854C172.062 21.9854 168.772 18.2955 168.772 13.5294C168.772 8.76335 172.062 5.07349 177.136 5.07349C182.209 5.07349 185.5 8.76335 185.5 13.5294Z' fill='black'/>
    <path d='M161.333 13.0682C161.333 10.147 159.55 8.14837 156.936 8.14837C154.476 8.14837 152.693 10.147 152.693 13.0682C152.693 15.9893 154.476 17.988 156.936 17.988C159.55 17.988 161.333 15.9893 161.333 13.0682ZM156.321 21.0629C151.862 21.0629 148.88 17.5268 148.88 13.0682C148.88 8.60961 151.862 5.07349 156.321 5.07349C158.935 5.07349 160.564 6.45719 161.179 7.22591V5.53472H164.992V19.6792C164.992 24.7528 161.548 27.5202 157.09 27.5202C153.246 27.5202 150.571 25.829 149.956 22.7541H153.861C154.353 24.1378 155.399 24.599 157.09 24.599C159.703 24.599 161.179 22.9078 161.179 19.6792V18.9105C160.564 19.6792 158.935 21.0629 156.321 21.0629Z' fill='black'/>
    <path d='M133.992 5.53472V7.5334C135.068 5.99595 136.852 5.07349 139.004 5.07349C142.848 5.07349 145.216 7.37965 145.216 11.5307V21.5241H141.403V11.8382C141.403 9.53207 140.388 8.30212 138.082 8.30212C135.776 8.30212 133.992 9.83956 133.992 12.7607V21.5241H130.179V5.53472H133.992Z' fill='black'/>
    <path d='M115.267 9.83956H111.331C111.823 6.94917 114.252 5.07349 118.465 5.07349C121.078 5.07349 123.2 5.78071 124.399 7.19516C125.199 8.11762 125.598 9.37833 125.598 10.9158V21.5241H121.786V19.6792C120.863 20.9092 119.387 21.9854 116.466 21.9854C113.237 21.9854 110.562 20.2942 110.562 16.7581C110.562 13.6832 112.93 12.0227 116.62 11.6845L121.786 11.2233V10.9158C121.786 9.07084 120.925 7.99463 118.465 7.99463C116.466 7.99463 115.513 8.6711 115.267 9.83956ZM117.081 19.0642C119.695 19.0642 121.786 17.5268 121.786 14.6056V13.9907L116.773 14.4519C115.359 14.5749 114.375 15.3744 114.375 16.7581C114.375 18.2955 115.482 19.0642 117.081 19.0642Z' fill='black'/>
    <path d='M100.023 17.2192V8.60948H96.1797V5.53459H100.023V1.84473H103.837V5.53459H108.141V8.60948H103.837V17.2192C103.837 18.1416 104.144 18.5414 105.067 18.5414H108.141V21.524H104.144C101.223 21.524 100.023 20.1403 100.023 17.2192Z' fill='black'/>
    <path d='M75.0194 5.53472V7.5334C76.0956 5.99595 77.879 5.07349 80.0314 5.07349C83.875 5.07349 86.2427 7.37965 86.2427 11.5307V21.5241H82.4298V11.8382C82.4298 9.53207 81.4151 8.30212 79.109 8.30212C76.8028 8.30212 75.0194 9.83956 75.0194 12.7607V21.5241H71.2065V5.53472H75.0194Z' fill='black'/>
    <path d='M63.0405 16.9118H67.1607C66.269 19.6792 63.6553 21.9854 59.5043 21.9854C54.3999 21.9854 51.2021 18.2955 51.2021 13.5294C51.2021 8.76335 54.4922 5.07349 59.412 5.07349C63.4709 5.07349 65.9309 7.22591 66.9456 10.4238C67.3146 11.5922 67.4683 12.9452 67.4683 14.2981V14.9131H55.1688C55.2918 16.9118 56.7369 19.0642 59.5043 19.0642C61.5952 19.0642 62.6715 17.8958 63.0405 16.9118ZM59.412 7.99463C56.9521 7.99463 55.4148 9.83956 55.1688 11.992H63.5016C63.4094 9.83956 61.9642 7.99463 59.412 7.99463Z' fill='black'/>
    <path d='M39.1971 14.7287V21.5242H35.3843V0H39.1971V11.8691L45.3777 5.53479H50.2667L42.5795 13.222L50.8817 21.5242H45.6852L39.1971 14.7287Z' fill='black'/>
    <path d='M18.6815 13.5294C18.6815 16.1431 20.0037 18.9105 23.2324 18.9105C26.461 18.9105 27.7832 16.1431 27.7832 13.5294C27.7832 10.9158 26.461 8.14837 23.2324 8.14837C20.0037 8.14837 18.6815 10.9158 18.6815 13.5294ZM31.596 13.5294C31.596 18.2955 28.3059 21.9854 23.2324 21.9854C18.1588 21.9854 14.8687 18.2955 14.8687 13.5294C14.8687 8.76335 18.1588 5.07349 23.2324 5.07349C28.3059 5.07349 31.596 8.76335 31.596 13.5294Z' fill='black'/>
    <path d='M4.35679 17.2192V8.60948H0.513184V5.53459H4.35679V1.84473H8.16965V5.53459H12.4744V8.60948H8.16965V17.2192C8.16965 18.1416 8.47714 18.5414 9.39961 18.5414H12.4744V21.524H8.47714C5.556 21.524 4.35679 20.1403 4.35679 17.2192Z' fill='black'/>
    </g>
    <defs>
    <clipPath id='clip0_532_1319'>
    <rect width='185' height='28' fill='white' transform='translate(0.506348)'/>
    </clipPath>
    </defs>
    </svg>
    "/>
              </Frame>
            </Frame>
          </AutoLayout>
          <Text name="Want to export your Figma Variables as Tokens? No problem! Validate naming conventions and export directly to Github." fill="#696969" width="fill-parent" verticalAlignText="center" horizontalAlignText="center" lineHeight="130%" fontFamily="Inter" fontSize={14} fontWeight={700}>
            Want to export your Figma Variables as tokens? No problem! Validate
            naming conventions and export directly to Github.
          </Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>);
};
