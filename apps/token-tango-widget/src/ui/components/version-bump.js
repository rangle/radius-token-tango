const { widget } = figma;
const { Text, AutoLayout, SVG } = widget;
export const VersionBump = ({ from, to, children, }) => {
    return (<AutoLayout name="Frame1000002102" overflow="visible" spacing={8} verticalAlignItems="center">
      <Text name="Versioning from:" fill="#767676" lineHeight="140%" fontFamily="Roboto" fontSize={12} letterSpacing={0.24}>
        Versioning from:
      </Text>
      <AutoLayout name="Frame 1000002069" fill="#868686" cornerRadius={999} overflow="visible" spacing={8} padding={{
            vertical: 8,
            horizontal: 16,
        }} verticalAlignItems="center">
        <AutoLayout name="Frame 1000002084" overflow="visible" spacing={4} verticalAlignItems="center">
          <AutoLayout name="Frame 1000002007" overflow="visible" spacing={8} verticalAlignItems="center">
            <Text name="previous-version" fill="#FFF" verticalAlignText="center" fontFamily="Roboto Mono" fontSize={12}>
              {from}
            </Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
      <SVG name="Arrow 5" width={20} src="<svg width='20' viewBox='0 0 20 0' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M20.7071 0.707107C21.0976 0.316582 21.0976 -0.316582 20.7071 -0.707107L14.3431 -7.07107C13.9526 -7.46159 13.3195 -7.46159 12.9289 -7.07107C12.5384 -6.68054 12.5384 -6.04738 12.9289 -5.65685L18.5858 0L12.9289 5.65685C12.5384 6.04738 12.5384 6.68054 12.9289 7.07107C13.3195 7.46159 13.9526 7.46159 14.3431 7.07107L20.7071 0.707107ZM0 1H20V-1H0V1Z' fill='black'/>
      </svg>
      "/>
      <AutoLayout name="Frame 1000002101" fill="#333" cornerRadius={999} overflow="visible" spacing={8} padding={{
            vertical: 8,
            horizontal: 16,
        }} verticalAlignItems="center">
        <AutoLayout name="Frame 1000002084" overflow="visible" spacing={4} verticalAlignItems="center">
          <AutoLayout name="Frame 1000002007" overflow="visible" spacing={8} verticalAlignItems="center">
            <Text name="next-version" fill="#FFF" verticalAlignText="center" fontFamily="Roboto Mono" fontSize={12}>
              {to}
            </Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>);
};
