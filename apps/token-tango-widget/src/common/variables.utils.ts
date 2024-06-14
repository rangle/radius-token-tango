import {
  FormatValidationResult,
  GlobalValidationResult,
  TokenCollection,
  TokenName,
  TokenNameCollection,
  TokenNameFormatType,
  TokenValidationResult,
  TokenVariable,
  VariablesMode,
  createValidatorFunctions,
} from "radius-toolkit";
import { isNotNil } from "radius-toolkit";

import { createLogger } from "@repo/utils";

const log = createLogger("utils:variables");

// type guard for VariableValue is alias
function isVariableAlias(value: VariableValue): value is VariableAlias {
  if (typeof value !== "object") return false;
  return (value as VariableAlias).type === "VARIABLE_ALIAS";
}

export const getAllLocalVariableTokens = async () => {
  const variableCollections: VariableCollection[] =
    await figma.variables.getLocalVariableCollectionsAsync();
  const collections = [] as TokenCollection[];

  // iterate through all the collections
  for (let x = 0; x < variableCollections.length; x++) {
    const collection = variableCollections[x];
    if (!collection) continue;
    const modes = collection.modes.map(
      (mode) =>
        ({
          name: mode.name,
          variables: [],
        }) as VariablesMode,
    );

    // through all the variables
    for (let i = 0; i < collection.variableIds.length; i++) {
      const variableId = collection.variableIds[i];
      if (!variableId) continue;
      const variable = await figma.variables.getVariableByIdAsync(variableId);

      if (!variable) continue;

      // iterate through all the variables
      for (let j = 0; j < collection.modes.length; j++) {
        const mode = collection.modes[j];
        if (!mode) continue;
        const value = variable?.valuesByMode[mode.modeId];

        if (value === undefined || value === null) continue;

        // if it's a variable id, we need to find the name of it
        if (isVariableAlias(value)) {
          const alias = await figma.variables.getVariableByIdAsync(value.id);
          if (!alias) continue;
          modes[j]?.variables.push({
            name: variable.name,
            alias: alias.name,
            type: alias.resolvedType,
            description: alias.description,
          });
        } else {
          // not a variable alias
          modes[j]?.variables.push({
            name: variable.name,
            value: value,
            type: variable.resolvedType,
            description: variable.description,
          });
        }
      }
    }

    collections.push({
      name: collection.name,
      modes,
    });
  }
  return collections;
};
export const validateTokenCollection = (
  format: TokenNameFormatType,
  [validateTokens, validateTokenCollections]: ReturnType<
    typeof createValidatorFunctions
  >,
  collections: TokenCollection[],
): FormatValidationResult[] => {
  log("debug", "validateTokenCollection 1");

  const allTokens = collections.flatMap((c) =>
    c.modes.flatMap(({ variables }) =>
      variables.map((v) => ({ ...v, collection: c.name })),
    ),
  );

  log("debug", "validateTokenCollection 2", allTokens.length);

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

  log("debug", "validateTokenCollection 3", tokenResults.length);

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
