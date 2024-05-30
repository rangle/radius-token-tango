import { isComposite } from "../common/figma.types.js";
import { ComponentUsage, TokenUse } from "../common/token.types.js";

export function getTokenStudioTokens(node: SceneNode): ComponentUsage {
  const sharedTokens = node.getSharedPluginDataKeys("tokens");

  const children = isComposite(node)
    ? node?.children?.map(getTokenStudioTokens)
    : [];
  const props = sharedTokens.reduce((tokens: TokenUse[], token: string) => {
    return token === "version"
      ? tokens
      : [
          ...tokens,
          {
            name: token,
            value: node
              .getSharedPluginData("tokens", token)
              .replace(/^["](.*)["]$/, "$1"),
            from: "token studio",
          } satisfies TokenUse,
        ];
  }, [] as TokenUse[]);

  return {
    id: node.id,
    name: node.name,
    props: props.flatMap((v) => v),
    children,
  } satisfies ComponentUsage;
}
