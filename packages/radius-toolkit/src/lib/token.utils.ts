import { TokenRule } from "./token.types";
import { ComponentUsage } from "./token.types";
import { TokenVariable } from "./token.types";

export const tokenTypeNames = [
  "color",
  "spacing",
  "fontWeight",
  "lineHeight",
  "opacity",
  "stroke",
  "strokeWidth",
  "width",
  "height",
  "textColor",
  "backgroundColor",
  "borderWidth",
  "borderRadius",
  "animation",
  "margin",
  "padding",
  // two custom types
  "grid",
  "size",
] as const;

export type TokeTypeName = (typeof tokenTypeNames)[number];

const isTokenType = (t: unknown): t is TokeTypeName =>
  tokenTypeNames.indexOf(t as TokeTypeName) !== -1;

export const isCamelCase = (s: string) =>
  /^[a-z0-9]+(?:[A-Z][a-z0-9]*)*$/.test(s) && !/[A-Z]{2}/.test(s);

const v3Tokens = true;

export const tokenRules: Record<string, TokenRule> = {
  "two-segments": {
    title: "non-primitive token names must have at least three segments",
    validate: (name) => {
      const segments = name.split(".");
      const [first, _second, third] = segments;
      if (third) return [true, ""];
      const tokenType = isTokenType(first) ? "primitive" : "semantic";
      if (tokenType === "primitive" && segments.length === 2) return [true, ""];
      if (tokenType === "semantic" && segments.length > 2) return [true, ""];
      return [
        false,
        `${tokenType} token ${name} does not have the right number of segments:
        for primitive tokens: {type}.{name}
        for semantic tokens: {subject}.{type}.{attributes}...
        `,
      ];
    },
  },
  "valid-case": {
    title: "token name segments must be in 'camelCase'",
    validate: (name) => {
      const segments = name.split(".");
      const invalidSegments = segments.filter((s) => !isCamelCase(s));
      return invalidSegments.length === 0
        ? [true, ""]
        : [
            false,
            `Token ${name} has segments with the wrong format. Segments ${invalidSegments
              .map((s) => `'${s}'`)
              .join(", ")} are not in camelCase.`,
            invalidSegments,
          ];
    },
  },
  "valid-type": {
    title: "token name must have a valid type",
    validate: (name) => {
      const segments = name.split(".");
      const [first, second] = segments;
      const tokenType = segments.length === 2 ? "primitive" : "semantic";
      const segment = tokenType === "primitive" ? first : second;
      if (isTokenType(segment)) return [true, ""];
      else {
        return [
          false,
          `${tokenType} token ${name} has an invalid type '${segment}'. 
          Valid types are: ${tokenTypeNames.join(", ")}`,
          [segment],
        ];
      }
    },
  },
};

export const v3TokenRules: Record<string, TokenRule> = {
  "two-segments": {
    title: "non-primitive token names must have at least three segments",
    validate: (name) => {
      const segments = name.split(".");
      const [_layer, first, _second, third] = segments;
      if (third) return [true, ""];
      const tokenType = isTokenType(first) ? "primitive" : "semantic";
      if (tokenType === "primitive" && segments.length === 3) return [true, ""];
      if (tokenType === "semantic" && segments.length > 3) return [true, ""];
      return [
        false,
        `${tokenType} token ${name} does not have the right number of segments:
        for primitive tokens: {layer}.{type}.{name}
        for semantic tokens: {layer}.{subject}.{type}.{attributes}...
        `,
      ];
    },
  },
  "valid-case": {
    title: "token name segments must be in 'camelCase'",
    validate: (name) => {
      const segments = name.split(".");
      const invalidSegments = segments.filter((s) => !isCamelCase(s));
      return invalidSegments.length === 0
        ? [true, ""]
        : [
            false,
            `Token ${name} has segments with the wrong format. Segments ${invalidSegments
              .map((s) => `'${s}'`)
              .join(", ")} are not in camelCase.`,
            invalidSegments,
          ];
    },
  },
  "valid-type": {
    title: "token name must have a valid type",
    validate: (name) => {
      const segments = name.split(".");
      const [_layer, first, second] = segments;
      const tokenType = segments.length === 3 ? "primitive" : "semantic";
      const segment = tokenType === "primitive" ? first : second;
      if (isTokenType(segment)) return [true, ""];
      else {
        return [
          false,
          `${tokenType} token ${name} has an invalid type '${segment}'. 
          Valid types are: ${tokenTypeNames.join(", ")}`,
          [segment],
        ];
      }
    },
  },
};

/// TODO: move this to a test file
// console.log("first.second.third".match(/([^.])*\.([^.])*\.([^.])*/));
//

export type TokenError = {
  key: string;
  title: string;
  message: string;
  segments: string[];
};

export type TokenValidationResult = {
  collection: string;
  variable: TokenVariable;
  errors: TokenError[];
};

type ReturnTuple = [ok: boolean, errs: TokenError[]];

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
