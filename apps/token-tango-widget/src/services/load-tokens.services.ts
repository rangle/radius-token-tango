// reads current version of tokens and variables of current document

import { isNotNil } from "../common/component.utils.js";
import { generateLayerFile } from "../common/generator.utils.js";
import {
  TokenValidationResult,
  validateTokenName,
} from "../common/token.utils.js";
import {
  TokenCollection,
  TokenVariable,
  getAllLocalVariableTokens,
} from "../common/variables.utils.js";

export const getTokenLayers = async (ignoreErrors: boolean) => {
  const tokenCollections = await getAllLocalVariableTokens();
  const errors = validateTokenCollection(tokenCollections);
  if (errors.length && !ignoreErrors)
    return [tokenCollections, undefined, errors] as const;
  const layers = generateLayerFile(tokenCollections);
  return [tokenCollections, layers, errors] as const;
};

// compare two versions of tokens, returning non-breaking changes and breaking changes

// validate tokens, returning list of errors

export const validateTokenInCollection =
  (collection: string) => (variable: TokenVariable) => {
    const [_name, ok, errors] = validateTokenName(
      variable.name.replace("/", "."),
    );
    if (ok) return undefined;
    return {
      collection,
      variable,
      errors,
    } satisfies TokenValidationResult;
  };

export const validateTokenCollection = (collections: TokenCollection[]) => {
  const results = collections.reduce((res, collection) => {
    const collectionName = collection.name;
    const variablesOfFirstMode = collection.modes[0].variables;
    return [
      ...res,
      ...variablesOfFirstMode
        .map(validateTokenInCollection(collectionName))
        .filter(isNotNil),
    ];
  }, [] as TokenValidationResult[]);

  return results;
};
