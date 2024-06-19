import { TokenNameCollection, TokenNameFormatType } from "../formats";
import { ComponentUsage, TokenCollection } from "./token.types";
import { TokenVariable } from "./token.types";

export const isNotNil = <T>(o: T | null | undefined): o is T => !!o;

export const calculateSubjectsFromProps =
  (format: TokenNameFormatType) => (componentProps: string[]) =>
    componentProps.reduce((subjects, prop) => {
      const nameDescription = format?.decomposeTokenName?.(prop);
      if (!nameDescription) return subjects;
      if (!nameDescription.otherSegments?.subject) return subjects;
      else return [...subjects, nameDescription.otherSegments?.subject];
    }, [] as string[]);

export const inferVariableType =
  (format: TokenNameFormatType) =>
  (variable: TokenVariable): string => {
    if (!format) {
      console.warn("no format selected");
      return variable.type;
    }
    // from type and name
    const name = variable.name.replaceAll("/", format.separator);
    const { type } = format.decomposeTokenName(name) || variable;
    return type;
  };

export const combineComponentUsage = (
  a: ComponentUsage,
  b: ComponentUsage
): ComponentUsage => {
  return {
    id: a.id,
    name: a.name,
    props: [...a.props, ...b.props],
    children: a.children.map((ac, index) =>
      combineComponentUsage(ac, b.children[index])
    ),
  };
};

export function toTokenNameCollection(
  collections: TokenCollection[],
  format: TokenNameFormatType
): TokenNameCollection[] {
  return collections
    .map(
      ({ name, modes: [mode] }) =>
        mode && {
          name: name,
          tokens: mode.variables.map((v) => ({
            name: v.name.replaceAll("/", format.separator) ?? "",
            type: v.type,
            alias: (v as TokenVariable).alias?.replaceAll(
              "/",
              format.separator
            ),
          })),
        }
    )
    .filter(isNotNil);
}
