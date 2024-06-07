import { TokenRule } from "./token.types";
import { ComponentUsage } from "./token.types";
import { TokenVariable } from "./token.types";


export type TokenValidationResult = {
  collection: string;
  variable: TokenVariable;
  errors: TokenError[];
};


export const validateTokenName = (
  name: string
): readonly [
  name: string,
  ok: boolean,
  errs: TokenError[],
  errorsBySegment: Record<string, TokenError[]>,
] => {
  const printableName = name.replaceAll("/", ".");
  // TODO: inject this boolean from the UI
  const rules = v3Tokens ? v3TokenRules : tokenRules;
  const [ok, errs] = Object.entries(rules).reduce<ReturnTuple>(
    ([ok, errs], [key, rule]) => {
      const [valid, errMsg, segments] = rule.validate(printableName);
      return ok && valid
        ? [true, []]
        : [
            false,
            [
              ...errs,
              {
                key,
                title: rule.title,
                message: errMsg,
                segments: segments ?? [],
              } satisfies TokenError,
            ],
          ];
    },
    [true, []]
  );

  const errorsBySegment = errs.reduce(
    (res, err) => {
      return {
        ...res,
        ...err.segments.reduce(
          (segmentIndex, segment) => ({
            ...segmentIndex,
            [segment]: [...(res[segment] ?? []), err],
          }),
          {} as Record<string, TokenError[]>
        ),
      };
    },
    {} as Record<string, TokenError[]>
  );

  return [printableName, ok, errs, errorsBySegment] as const;
};

export const calculateSubjectsFromProps = (componentProps: string[]) =>
  componentProps.reduce((subjects, prop) => {
    const [_, _layer, subject, _type, _attributes] =
      prop.replaceAll("/", ".").match(/([^.]*)\.([^.]*)\.([^.]*)/) ?? [];
    if (!subject || subjects.indexOf(subject) !== -1 || isTokenType(subject))
      return subjects;
    else return [...subjects, subject];
  }, [] as string[]);

export const inferVariableType = (variable: TokenVariable): string => {
  // from type and name
  const segments = variable.name.split("/");
  const [first, second] = segments;

  if (tokenTypeNames.indexOf(second as TokeTypeName) !== -1) return second;
  if (tokenTypeNames.indexOf(first as TokeTypeName) !== -1) return first;
  return variable.type.toLocaleLowerCase();
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
