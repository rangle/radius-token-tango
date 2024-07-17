import {
  TokenName,
  TokenNameCollection,
  TokenNameFormatType,
  TokenValue,
} from "../formats";
import { ComponentUsage, TokenCollection, VariablesMode } from "./token.types";
import { TokenVariable } from "./token.types";
import { createLogger } from "../utils/logging.utils";

const log = createLogger("lib:tokens");

export const isNotNil = <T>(o: T | null | undefined): o is T => !!o;

export const calculateSubjectsFromProps =
  (format: TokenNameFormatType) => (componentProps: string[]) =>
    componentProps.reduce((subjects, prop) => {
      const nameDescription = format?.decomposeTokenName?.(prop);
      if (!nameDescription) return subjects;
      if (!nameDescription.otherSegments?.subject) return subjects;
      if (subjects.includes(nameDescription.otherSegments?.subject))
        return subjects;
      else return [...subjects, nameDescription.otherSegments?.subject];
    }, [] as string[]);

export const inferVariableType =
  (format: TokenNameFormatType) =>
  (variable: TokenVariable): string => {
    if (!format) {
      log("warn", "no format selected");
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

export const toTokenNameCollection = (
  collections: TokenCollection[],
  format: TokenNameFormatType
): TokenNameCollection[] => {
  let references: Record<string, TokenName> = {};
  return collections
    .map(({ name, modes }) => {
      const mode = modes[0];
      if (!mode) return null;
      const tokens = mode.variables.map(toTokenName(format, modes));
      tokens.forEach((t) => {
        references[t.name] = t;
      });
      return {
        name: name,
        modes: modes.map((m) => m.name),
        tokens,
      };
    })
    .filter(isNotNil);
};

export const toTokenName = (
  format: TokenNameFormatType,
  modes: VariablesMode[]
) => {
  const getType = inferVariableType(format);
  return (variable: TokenVariable, idx: number): TokenName => {
    const variableValues = findVariableValueInAllModes(modes, idx);
    const isAlias = Object.values(variableValues).some((v) => "alias" in v);
    return {
      name: variable.name.replaceAll("/", format.separator),
      type: getType(variable),
      isAlias,
      values: variableValues,
    };
  };
};

const findVariableValueInAllModes = (modes: VariablesMode[], idx: number) => {
  return modes.reduce(
    (acc, mode) => {
      const variable = mode.variables[idx];
      if (!variable) return acc;
      return {
        ...acc,
        [mode.name]: variable.alias
          ? { alias: variable.alias.replaceAll("/", ".") }
          : { value: variable.value },
      };
    },
    {} as Record<string, TokenValue>
  );
};
