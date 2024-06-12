import { TokenNameFormatType } from "../formats";
import { ComponentUsage } from "./token.types";
import { TokenVariable } from "./token.types";

export const calculateSubjectsFromProps =
  (format: TokenNameFormatType) => (componentProps: string[]) =>
    componentProps.reduce((subjects, prop) => {
      const nameDescription = format.decomposeTokenName(prop);
      if (!nameDescription) return subjects;
      if (!nameDescription.otherSegments?.subject) return subjects;
      else return [...subjects, nameDescription.otherSegments?.subject];
    }, [] as string[]);

export const inferVariableType =
  (format: TokenNameFormatType) =>
  (variable: TokenVariable): string => {
    // from type and name
    const name = variable.name.replace("/", ".");
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
