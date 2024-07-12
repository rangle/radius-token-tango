// reads current version of tokens and variables of current document

import { isNotNil, toTokenNameCollection } from "radius-toolkit";
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

import { createLogger } from "@repo/utils";

const log = createLogger("services:load-tokens");

export const getTokenLayers = async (
  format: TokenNameFormatType,
  ignoreErrors: boolean,
) => {
  log("debug", "getTokenLayers 1");
  const validators = createValidatorFunctions(format);
  log("debug", "getTokenLayers 2");
  const tokenCollections = await getAllLocalVariableTokens();
  log("debug", "getTokenLayers 3", tokenCollections.length);
  const errors = validateTokenCollection(format, validators, tokenCollections);
  log("debug", "getTokenLayers 4", errors.length);
  if (errors.length && !ignoreErrors)
    return [tokenCollections, undefined, errors] as const;
  log("debug", "getTokenLayers 5");
  const layers = generateLayerFile(tokenCollections, format);
  log("debug", "getTokenLayers 6", layers);
  log(
    "debug",
    "getTokenLayers 7",
    layers.layers[2]?.variables.map(({ name, type, value }) => [
      name,
      type,
      value,
    ]),
  );
  return [tokenCollections, layers, errors] as const;
};

export const validateTokenCollection = (
  format: TokenNameFormatType,
  [validateTokens, validateTokenCollections]: ReturnType<
    typeof createValidatorFunctions
  >,
  collections: TokenCollection[],
): FormatValidationResult[] => {
  log("debug", "validateTokenCollection 1");

  const allTokens = collections
    .flatMap((c) =>
      c?.modes?.[0]?.variables.map((v) => ({ ...v, collection: c.name })),
    )
    .filter(isNotNil);

  log("debug", "validateTokenCollection 2", allTokens.length);

  const tokenResults = allTokens.reduce<TokenValidationResult[]>(
    (issues, token) => {
      const tokenName: TokenName = {
        name: token.name.replaceAll("/", format.separator) ?? "",
        type: token.type,
        isAlias: !!token.alias,
      };
      const [errors, warnings] = validateTokens(tokenName.name, tokenName.type);

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

  log("debug", "validateTokenCollection 3", tokenResults.length);

  const tokenNameCollections: TokenNameCollection[] = toTokenNameCollection(
    collections,
    format,
  );

  log("debug", "validateTokenCollection 4", tokenNameCollections.length);

  const [collectionErrors, collectionWarnings] =
    validateTokenCollections(tokenNameCollections);

  log(
    "debug",
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

  log("debug", "validateTokenCollection 6", collectionResults.length);

  return [...tokenResults, ...collectionResults];
};
