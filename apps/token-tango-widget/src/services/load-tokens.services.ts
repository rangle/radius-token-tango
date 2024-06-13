// reads current version of tokens and variables of current document

import { isNotNil } from "../common/component.utils";
import { generateLayerFile } from "../common/generator.utils";
import {
  TokenCollection,
  TokenVariable,
  TokenValidationResult,
  GlobalValidationResult,
  FormatValidationResult,
  TokenNameFormatType,
  createValidatorFunctions,
  TokenNameCollection,
  TokenName,
} from "radius-toolkit";
import { getAllLocalVariableTokens } from "../common/variables.utils";

export const getTokenLayers = async (
  format: TokenNameFormatType,
  ignoreErrors: boolean,
) => {
  console.log("getTokenLayers 1");
  const validators = createValidatorFunctions(format);
  console.log("getTokenLayers 2");
  const tokenCollections = await getAllLocalVariableTokens();
  console.log("getTokenLayers 3", tokenCollections.length);
  const errors = validateTokenCollection(format, validators, tokenCollections);
  console.log("getTokenLayers 4", errors.length);
  if (errors.length && !ignoreErrors)
    return [tokenCollections, undefined, errors] as const;
  console.log("getTokenLayers 5");
  const layers = generateLayerFile(tokenCollections);
  console.log("getTokenLayers 6", layers);
  return [tokenCollections, layers, errors] as const;
};

export const validateTokenCollection = (
  format: TokenNameFormatType,
  [validateTokens, validateTokenCollections]: ReturnType<
    typeof createValidatorFunctions
  >,
  collections: TokenCollection[],
): FormatValidationResult[] => {
  console.log("validateTokenCollection 1");

  const allTokens = collections.flatMap((c) =>
    c.modes.flatMap(({ variables }) =>
      variables.map((v) => ({ ...v, collection: c.name })),
    ),
  );

  console.log("validateTokenCollection 2", allTokens.length);

  const tokenResults = allTokens.reduce<TokenValidationResult[]>(
    (issues, token) => {
      const tokenName: TokenName = {
        name: token.name.replaceAll("/", format.separator) ?? "",
        alias: token.alias?.replaceAll("/", format.separator),
      };
      const [errors, warnings] = validateTokens(tokenName.name);

      return [
        ...issues,
        ...(errors ?? []).map(({ message, offendingSegments }) => ({
          type: "token",
          collection: token.collection,
          token: tokenName,
          isWarning: false,
          message: message ?? "",
          offendingSegments: offendingSegments ?? [],
        })),
        ...(warnings ?? []).map(({ message, offendingSegments }) => ({
          type: "token",
          collection: token.collection,
          token: tokenName,
          isWarning: true,
          message: message ?? "",
          offendingSegments: offendingSegments ?? [],
        })),
      ];
    },
    [] as TokenValidationResult[],
  );

  console.log("validateTokenCollection 3", tokenResults.length);

  const tokenNameCollections: TokenNameCollection[] = collections
    .map(
      ({ name, modes: [mode] }) =>
        mode && {
          name: name,
          tokens: mode.variables.map((v) => ({
            name: v.name.replaceAll("/", format.separator) ?? "",
            alias: (v as TokenVariable).alias?.replaceAll(
              "/",
              format.separator,
            ),
          })),
        },
    )
    .filter(isNotNil);

  console.log("validateTokenCollection 4", tokenNameCollections.length);

  const [collectionErrors, collectionWarnings] =
    validateTokenCollections(tokenNameCollections);

  console.log(
    "validateTokenCollection 5",
    collectionErrors?.length,
    collectionWarnings?.length,
  );

  const collectionResults: GlobalValidationResult[] = [
    ...(collectionErrors ?? []).map(({ message, offendingSegments }) => ({
      type: "collection",
      isWarning: false,
      message: message ?? "",
      offendingSegments: offendingSegments ?? [],
    })),
    ...(collectionWarnings ?? []).map(({ message, offendingSegments }) => ({
      type: "collection",
      isWarning: true,
      message: message ?? "",
      offendingSegments: offendingSegments ?? [],
    })),
  ];

  console.log("validateTokenCollection 6", collectionResults.length);

  return [...tokenResults, ...collectionResults];
};
