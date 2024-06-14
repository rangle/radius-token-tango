const { widget } = figma;
const { Frame, SVG, AutoLayout } = widget;

const iconSrc = {
  "add-box": `<svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path fill-rule='evenodd' clip-rule='evenodd' d='M1.33333 0H10.6667C11.4 0 12 0.6 12 1.33333V10.6667C12 11.4 11.4 12 10.6667 12H1.33333C0.593333 12 0 11.4 0 10.6667V1.33333C0 0.6 0.593333 0 1.33333 0ZM6.66667 6.66667H9.33333V5.33333H6.66667V2.66667H5.33333V5.33333H2.66667V6.66667H5.33333V9.33333H6.66667V6.66667Z' fill='#262626'/>
    </svg>`,

  figma: `
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-figma"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"></path><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"></path><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"></path></svg>
`,

  github: `
<svg width='14' height='13' viewBox='0 0 14 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M7.00001 0.333313C3.3189 0.333313 0.333344 3.24075 0.333344 6.82676C0.333344 9.69577 2.24334 12.1297 4.89279 12.9885C5.22557 13.0486 5.33334 12.8473 5.33334 12.6763V11.4674C3.4789 11.8603 3.09279 10.7012 3.09279 10.7012C2.78945 9.95064 2.35223 9.75097 2.35223 9.75097C1.74723 9.34783 2.39834 9.35649 2.39834 9.35649C3.06779 9.40195 3.42001 10.0259 3.42001 10.0259C4.01445 11.0183 4.97945 10.7315 5.36001 10.5654C5.41945 10.146 5.59223 9.85919 5.78334 9.6974C4.30279 9.53236 2.74612 8.97554 2.74612 6.48801C2.74612 5.77861 3.00668 5.19961 3.43279 4.74507C3.3639 4.58111 3.13557 3.9204 3.49779 3.02647C3.49779 3.02647 4.05779 2.85223 5.33168 3.69205C5.86334 3.54811 6.43334 3.47614 7.00001 3.47343C7.56668 3.47614 8.13723 3.54811 8.67001 3.69205C9.94279 2.85223 10.5017 3.02647 10.5017 3.02647C10.8645 3.92094 10.6361 4.58165 10.5672 4.74507C10.995 5.19961 11.2533 5.77915 11.2533 6.48801C11.2533 8.98204 9.6939 9.53127 8.20945 9.69199C8.44834 9.89328 8.66668 10.2883 8.66668 10.8944V12.6763C8.66668 12.8489 8.77334 13.0518 9.11168 12.9879C11.7589 12.1281 13.6667 9.69469 13.6667 6.82676C13.6667 3.24075 10.6817 0.333313 7.00001 0.333313Z' fill='#262626'/>
</svg>
`,

  alert: `
<svg width='16' height='13' viewBox='0 0 16 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path fill-rule='evenodd' clip-rule='evenodd' d='M0.666656 13L7.99999 0.333313L15.3333 13H0.666656ZM13.02 11.6666L7.99999 2.99331L2.97999 11.6666H13.02ZM7.33332 9.66665V11H8.66666V9.66665H7.33332ZM7.33332 5.66665H8.66666V8.33331H7.33332V5.66665Z' fill='#262626'/>
</svg>
`,

  check: `
<svg width='12' height='10' viewBox='0 0 12 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M4.00001 7.78002L1.22001 5.00002L0.273346 5.94002L4.00001 9.66668L12 1.66668L11.06 0.726685L4.00001 7.78002Z' fill='#262626'/>
</svg>
`,

  close: `
<svg width='10' height='10' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M9.66668 1.27331L8.72668 0.333313L5.00001 4.05998L1.27334 0.333313L0.333344 1.27331L4.06001 4.99998L0.333344 8.72665L1.27334 9.66665L5.00001 5.93998L8.72668 9.66665L9.66668 8.72665L5.94001 4.99998L9.66668 1.27331Z' fill='#262626' />
</svg>
`,

  variables: `
  <svg width='14' height='16' viewBox='0 0 14 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
  <path fill-rule='evenodd' clip-rule='evenodd' d='M7 0L14 4.00044V11.9978L7 16L0 11.9978V4.00044L7 0ZM1.76589 5.00886V10.9911L7 13.9814L12.2341 10.9911V5.00711L7 2.01857L1.76589 5.00886Z' fill='#262626'/>
  <path d='M8.6383 7.70368C8.6383 8.68679 7.83762 9.48146 6.85107 9.48146C5.86451 9.48146 5.06383 8.68679 5.06383 7.70368C5.06383 6.72235 5.86451 5.9259 6.85107 5.9259C7.83762 5.9259 8.6383 6.72235 8.6383 7.70368Z' fill='#262626'/>
  </svg>
`,

  tokens: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M156,92V80H144a16,16,0,0,0-16,16v64a16,16,0,0,0,16,16h12V164a16,16,0,0,1,16-16h40a16,16,0,0,1,16,16v40a16,16,0,0,1-16,16H172a16,16,0,0,1-16-16V192H144a32.1,32.1,0,0,1-32-32V136H84v8a16,16,0,0,1-16,16H36a16,16,0,0,1-16-16V112A16,16,0,0,1,36,96H68a16,16,0,0,1,16,16v8h28V96a32.1,32.1,0,0,1,32-32h12V52a16,16,0,0,1,16-16h40a16,16,0,0,1,16,16V92a16,16,0,0,1-16,16H172A16,16,0,0,1,156,92Z"/></svg>
`,
  instance: `<svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path fill-rule='evenodd' clip-rule='evenodd' d='M16 8L8 0L0 8L8 16L16 8Z' fill='#262626'/>
</svg>`,
  component: `<svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path fill-rule='evenodd' clip-rule='evenodd' d='M4.50044 3.50044L5.12889 4.12889L7.37156 6.37156L8 7L8.62844 6.37156L10.8711 4.12889L11.4996 3.50044L10.8711 2.87111L8.62844 0.628444L8 0L7.37156 0.628444L5.12889 2.87111L4.50044 3.50044ZM4.50044 12.4996L5.12889 13.1289L7.37156 15.3716L8 16L8.62844 15.3716L10.8711 13.1289L11.4996 12.5004L10.8711 11.8711L8.62844 9.62844L8 9L7.37156 9.62844L5.12889 11.8711L4.50044 12.4996ZM0.628444 8.62844L0 8L0.628444 7.37156L2.87111 5.12889L3.50044 4.50044L4.12889 5.12889L6.37156 7.37156L7 8L6.37156 8.62844L4.12889 10.8711L3.50044 11.4996L2.87111 10.8711L0.628444 8.62844ZM9 8L9.62844 8.62844L11.8711 10.8711L12.4996 11.4996L13.1289 10.8711L15.3716 8.62844L16 8L15.3716 7.37156L13.1289 5.12889L12.5004 4.50044L11.8711 5.12889L9.62844 7.37156L9 8Z' fill='#262626'/>
</svg>`,
  refresh: `<svg width='11' height='16' viewBox='0 0 11 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path fill-rule='evenodd' clip-rule='evenodd' d='M5.68 0.666687V2.66669C8.5088 2.66669 10.8 5.05335 10.8 8.00002C10.8 9.04669 10.5056 10.02 10.0064 10.84L9.072 9.86669C9.36 9.31335 9.52 8.67335 9.52 8.00002C9.52 5.79335 7.7984 4.00002 5.68 4.00002V6.00002L3.12 3.33335L5.68 0.666687ZM1.84 8.00002C1.84 10.2067 3.5616 12 5.68 12V10L8.24 12.6667L5.68 15.3334V13.3334C2.8512 13.3334 0.559998 10.9467 0.559998 8.00002C0.559998 6.95335 0.854398 5.98002 1.3536 5.16002L2.288 6.13335C2 6.68669 1.84 7.32669 1.84 8.00002Z' fill='#262626'/>
</svg>`,
  radius: `
<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M9 8.99998L21 21' stroke='#D44527' stroke-width='2' stroke-miterlimit='10'/>
<path d='M6.44444 21.9043H2C2.01369 16.6042 4.12522 11.525 7.87298 7.77728C11.6207 4.02952 16.6999 1.91798 22 1.9043V6.38579C17.8808 6.38578 13.9298 8.01957 11.0136 10.9288C8.09748 13.838 6.45425 17.7851 6.44444 21.9043Z' fill='#262626'/>
</svg>
`,
  clock: `<svg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M9.20004 10.1333L10.1334 9.19998L7.66671 6.73331V3.66665H6.33337V7.26665L9.20004 10.1333ZM7.00004 13.6666C6.07782 13.6666 5.21115 13.4915 4.40004 13.1413C3.58893 12.7915 2.88337 12.3166 2.28337 11.7166C1.68337 11.1166 1.20849 10.4111 0.858707 9.59998C0.508485 8.78887 0.333374 7.9222 0.333374 6.99998C0.333374 6.07776 0.508485 5.21109 0.858707 4.39998C1.20849 3.58887 1.68337 2.88331 2.28337 2.28331C2.88337 1.68331 3.58893 1.2082 4.40004 0.85798C5.21115 0.508202 6.07782 0.333313 7.00004 0.333313C7.92226 0.333313 8.78893 0.508202 9.60004 0.85798C10.4112 1.2082 11.1167 1.68331 11.7167 2.28331C12.3167 2.88331 12.7916 3.58887 13.1414 4.39998C13.4916 5.21109 13.6667 6.07776 13.6667 6.99998C13.6667 7.9222 13.4916 8.78887 13.1414 9.59998C12.7916 10.4111 12.3167 11.1166 11.7167 11.7166C11.1167 12.3166 10.4112 12.7915 9.60004 13.1413C8.78893 13.4915 7.92226 13.6666 7.00004 13.6666Z' fill='#262626'/>
</svg>`,
  gear: `<svg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M5.16672 13.6666L4.90005 11.5333C4.7556 11.4778 4.6196 11.4111 4.49205 11.3333C4.36405 11.2555 4.23894 11.1722 4.11672 11.0833L2.13338 11.9166L0.300049 8.74998L2.01672 7.44998C2.0056 7.3722 2.00005 7.29709 2.00005 7.22465V6.77465C2.00005 6.70265 2.0056 6.62776 2.01672 6.54998L0.300049 5.24998L2.13338 2.08331L4.11672 2.91665C4.23894 2.82776 4.36672 2.74442 4.50005 2.66665C4.63338 2.58887 4.76672 2.5222 4.90005 2.46665L5.16672 0.333313H8.83338L9.10005 2.46665C9.24449 2.5222 9.38071 2.58887 9.50871 2.66665C9.63627 2.74442 9.76116 2.82776 9.88338 2.91665L11.8667 2.08331L13.7 5.24998L11.9834 6.54998C11.9945 6.62776 12 6.70265 12 6.77465V7.22465C12 7.29709 11.9889 7.3722 11.9667 7.44998L13.6834 8.74998L11.85 11.9166L9.88338 11.0833C9.76116 11.1722 9.63338 11.2555 9.50005 11.3333C9.36672 11.4111 9.23338 11.4778 9.10005 11.5333L8.83338 13.6666H5.16672ZM7.03338 9.33331C7.67783 9.33331 8.22783 9.10553 8.68338 8.64998C9.13894 8.19442 9.36672 7.64442 9.36672 6.99998C9.36672 6.35553 9.13894 5.80553 8.68338 5.34998C8.22783 4.89442 7.67783 4.66665 7.03338 4.66665C6.37783 4.66665 5.82494 4.89442 5.37472 5.34998C4.92494 5.80553 4.70005 6.35553 4.70005 6.99998C4.70005 7.64442 4.92494 8.19442 5.37472 8.64998C5.82494 9.10553 6.37783 9.33331 7.03338 9.33331Z' fill='#262626'/>
</svg>`,
  git: `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="7.5" cy="6.5" r="3" fill="#262626"/>
<circle cx="16.5" cy="6.5" r="3" fill="#262626"/>
<path d="M10.5 18.5C10.5 20.1569 9.15685 21.5 7.5 21.5C5.84315 21.5 4.5 20.1569 4.5 18.5C4.5 16.8431 5.84315 15.5 7.5 15.5C9.15685 15.5 10.5 16.8431 10.5 18.5Z" fill="#262626"/>
<line x1="7.5" y1="6.5" x2="7.5" y2="18.5" stroke="#262626" stroke-width="2"/>
<path d="M16.5 7.5V8C16.5 10.4853 14.4853 12.5 12 12.5V12.5C9.51472 12.5 7.5 14.5147 7.5 17V18.5" stroke="#262626" stroke-width="2"/>
</svg>
`,
  warning: `<svg width="16" height="16" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.666687 13L8.00002 0.333344L15.3334 13H0.666687ZM13.02 11.6667L8.00002 2.99334L2.98002 11.6667H13.02ZM7.33335 9.66668V11H8.66669V9.66668H7.33335ZM7.33335 5.66668H8.66669V8.33334H7.33335V5.66668Z" fill="#262626"/>
</svg>
`,
  circle: `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="4" cy="4" r="4" fill="#262626"/>
</svg>
`,
  ["chevron-down"]: `<svg width="16" height="16" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.4235 0.589966L6.8335 5.16997L2.2435 0.589966L0.833496 1.99997L6.8335 7.99997L12.8335 1.99997L11.4235 0.589966Z" fill="#262626"/>
</svg>
`,
  ["chevron-up"]: `<svg width="16" height="16" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 0L0 6L1.41 7.41L6 2.83L10.59 7.41L12 6L6 0Z" fill="#262626"/>
</svg>
`,

  switch: `
  <svg width="27" height="22" viewBox="0 0 27 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20.8759 19L26.1919 8.74943L14.6566 9.27098L20.8759 19ZM11.2037 2.17425C13.8326 1.62738 15.5916 2.41469 16.8536 3.85257C18.1798 5.36356 19.0136 7.66765 19.4865 10.1932L21.4523 9.82507C20.9543 7.1655 20.0328 4.44284 18.3568 2.53326C16.6165 0.550558 14.1263 -0.476537 10.7963 0.216166L11.2037 2.17425Z" fill="#262626"/>
  <path d="M6.12407 2L0.713178 12.2008L12.2527 11.7864L6.12407 2ZM15.7855 19.8172C14.4091 20.1195 13.2999 20.0263 12.3936 19.6892C11.4845 19.3511 10.7093 18.7414 10.0461 17.9006C8.69649 16.1898 7.87756 13.6059 7.43455 10.8373L5.45967 11.1533C5.92121 14.0377 6.80961 17.0271 8.4758 19.1393C9.32042 20.21 10.3802 21.0742 11.6964 21.5638C13.0154 22.0543 14.5218 22.1424 16.2145 21.7707L15.7855 19.8172Z" fill="#262626"/>
  </svg>  
`,
  open: `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5 5V19H19V12H21V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H12V5H5ZM14 5V3H21V10H19V6.41L9.17 16.24L7.76 14.83L17.59 5H14Z" fill="#262626"/>
</svg>
`,
};

export type IconType = keyof typeof iconSrc;

export type IconProps = Partial<FrameProps> & {
  icon: IconType;
  color?: string;
  size?: number;
};

export function Icon16px({
  icon,
  color = "#262626",
  size = 16,
  ...props
}: IconProps) {
  const source = iconSrc[icon].replaceAll(`#262626`, color);
  return (
    <AutoLayout name="static-icon-button" overflow="visible" padding={2}>
      <Frame
        name="Icon"
        strokeWidth={1.333}
        width={size}
        height={size}
        {...props}
      >
        <SVG name={`icon/${icon}`} height={size} width={size} src={source} />
      </Frame>
    </AutoLayout>
  );
}
