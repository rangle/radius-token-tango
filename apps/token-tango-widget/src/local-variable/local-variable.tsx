import { isComposite } from "../common/figma.types.js";
import { ComponentUsage, TokenUse, isTokenUse } from "radius-toolkit";

// type BoundVariables = SliceNode['boundVariables'];
type KeysOfBoundVariables = SceneNode["boundVariables"] extends infer BV
  ? BV extends Record<string, object>
    ? keyof BV
    : never
  : never;

export async function getLocalVariables(
  node: SceneNode,
): Promise<ComponentUsage> {
  const variables = node?.boundVariables;
  if (!variables) {
    console.log("no boundVariables: returning empty");
    return {
      id: node.id,
      name: node.name,
      props: [],
      children: [],
    };
  }

  console.log(`'${node.name}'`, "variables:", variables);

  const children = isComposite(node)
    ? node.children.map(getLocalVariables)
    : [];

  if (!isComposite(node)) console.log("WEIRD CHILDREN", node.type);

  // for each key in variables we need to make a async query to get the current value of the variable
  const props = await Promise.all(
    (Object.keys(variables) as KeysOfBoundVariables[]).flatMap(
      async (daKey): Promise<TokenUse[]> => {
        const key = String(daKey);
        const variableValue = variables[daKey];
        if (!variableValue) return [] satisfies TokenUse[];
        if (Array.isArray(variableValue)) {
          // for each item in the array get the get variable by id
          const daList = await Promise.all(
            variableValue.flatMap<Promise<TokenUse | undefined>>(
              async (variable): Promise<TokenUse | undefined> => {
                const value = await figma.variables.getVariableByIdAsync(
                  variable.id,
                );
                return value
                  ? ({
                      name: key,
                      value: value.name,
                      from: "variable",
                    } satisfies TokenUse)
                  : undefined;
              },
            ),
          ).then((list) => list.filter(isTokenUse));
          return daList;
        } else if (typeof variableValue.id === "string") {
          const value = await figma.variables.getVariableByIdAsync(
            variableValue.id,
          );
          const alternateList = value
            ? ([
                {
                  name: key,
                  value: value.name,
                  from: "variable",
                },
              ] satisfies TokenUse[])
            : ([] satisfies TokenUse[]);
          return alternateList;
        }
        return [] satisfies TokenUse[];
      },
    ),
  );

  return {
    id: node.id,
    name: node.name,
    props: props.flatMap((v) => v),
    children: await Promise.all(children),
  } satisfies ComponentUsage;
}
