import {
  TokenLayer,
  TokenLayers,
  TokenName,
  TokenValidationResult,
  TokenValue,
  VectorOutput,
  diffTokenLayers,
  formatLayerName,
  isExpression,
  isString,
  isTokenValidationResult,
  isVariableAlias,
  isVariableReference,
  toTokenNameCollection,
} from "radius-toolkit";

import { State } from "../../../token-tango-widget/types/state";

import { createLogger } from "@repo/utils";

const log = createLogger("WEB:library.services");

export type TokenEntry = {
  errors: {
    message: string;
    segments: string[];
    type: "error";
  }[];
  warnings: {
    message: string;
    segments: string[];
    type: "warning";
  }[];
  collection: string;
  name: string;
  description: string;
  type: string;
  isAlias: boolean;
  references?: Record<string, TokenValue>;
  values: Record<string, TokenValue>;
  valuesPerMode?: Record<string, readonly [TokenValue, TokenValue | undefined]>;
  changeType?: "added" | "modified" | "deleted";
};

export type TokenValueIndex = Record<string, Record<string, TokenValue>>;

export type CollectionEntry = {
  name: string;
  modes: string[];
  description: string;
  tokens: TokenEntry[];
  allIndexes: TokenValueIndex;
};

export type VectorEntry = {
  name: string;
  description: string;
  properties: Record<string, string>;
  shouldExport: boolean;
  src: string;
  previousSrc?: string;
  changeType?: "added" | "modified" | "deleted";
};

export type VectorCollection = {
  name: string;
  vectors: VectorEntry[];
};

export const toTokenValues = (
  token: string,
  layers: TokenLayer[] | undefined
) => {
  if (!layers || layers.length < 1) return {};
  return layers.reduce(
    (acc, layer) => {
      const value = layer.variables.find((v) => v.name === token)?.value;
      return {
        ...acc,
        [layer.name]: isVariableReference(value ?? "")
          ? { alias: value }
          : { value },
      } as Record<string, TokenValue>;
    },
    {} as Record<string, TokenValue>
  );
};

/**
 * From the state of the widget, generate the collection entries
 * to be used in the library view
 * @param state Full state of the Widget
 * @returns Collection entries
 */
export const toCollectionEntries = (state: State): CollectionEntry[] => {
  const { collections, issues, format, oldTokenLayers, tokenLayers } = state;

  // convert original collection to token name collection using radius-toolkit
  const nameCollections = toTokenNameCollection(collections, format);

  // find which tokens were added/modified/deleted based on the difference
  // between new and old token layers
  const [added, modified, deleted] = diffTokenLayers(
    tokenLayers,
    oldTokenLayers
  );

  // iterate for every name collection and generate the collection entries
  const entryCollections = nameCollections.map((collection) => {
    const { name: collectionName, modes, tokens } = collection;
    const tokenIssues = issues
      .filter(isTokenValidationResult)
      .filter((issue) => issue.collection === collectionName);
    log("warn", collectionName, "issues", tokenIssues);
    const tokenEntries = tokens.map(
      toTokenEntry(
        tokenLayers,
        oldTokenLayers,
        tokenIssues,
        collectionName,
        added,
        modified,
        deleted
      )
    );

    // index all token values by token name
    const index = tokenEntries.reduce(
      (acc, token) => ({
        ...acc,
        [token.name]: token.values,
      }),
      {} as TokenValueIndex
    );

    return {
      name: collectionName,
      description: collectionName,
      modes,
      tokens,
      tokenEntries,
      index,
    };
  });

  // merge collection indexes in a single index
  const allIndexes = entryCollections.reduce(
    (acc, collection) => ({
      ...acc,
      ...collection.index,
    }),
    {} as TokenValueIndex
  );

  // return the collection entries
  return entryCollections.map((collection) => {
    const { name, description, modes, tokenEntries } = collection;
    return {
      name,
      description,
      modes,
      tokens: tokenEntries,
      allIndexes,
    } satisfies CollectionEntry;
  });
};

/**
 * Finds differences between new and old list of vectors
 * @param a list of vectors
 * @param b previous list of vectors
 * @returns tuple with added, modified and deleted vectors
 */

export const diffVectors = (a: VectorOutput[], b: VectorOutput[]) => {
  const added = a.filter((v) => !b.some((bv) => bv.name === v.name));
  const modified = a.filter((v) =>
    b.some(
      (bv) =>
        bv.name === v.name &&
        (bv.source !== v.source ||
          bv.description !== v.description ||
          Object.entries(bv.properties).join() !==
            Object.entries(v.properties).join())
    )
  );
  const deleted = b.filter((v) => !a.some((av) => av.name === v.name));
  return [added, modified, deleted] as const;
};

/**
 * extract vector collections from the state of the widget
 * @param state state of the widget
 * @returns array of vector collections
 */

export const toVectorCollectionEntries = (state: State): VectorCollection[] => {
  const { vectors, oldTokenLayers } = state;

  if (!vectors || !vectors.length) return [];

  const oldVectors = oldTokenLayers?.vectors ?? [];

  // get changes between vectors in old and new token layers
  const [added, modified, deleted] = diffVectors(vectors, oldVectors);

  // convert vectors to vector entries
  const vectorEntries = vectors.map((vector) => {
    const { name, description, parent, properties, source } = vector;
    return {
      name,
      description: description ?? name,
      properties,
      shouldExport: true,
      src: source,
      changeType: added.some((v) => v.name === name)
        ? ("added" as const)
        : modified.some((v) => v.name === name)
          ? ("modified" as const)
          : deleted.some((v) => v.name === name)
            ? ("deleted" as const)
            : undefined,
    } satisfies VectorEntry;
  });

  // organize them by parent
  const entriesByParent = vectorEntries.reduce(
    (acc, vector) => {
      const parent = vector.properties.parent ?? "";
      return {
        ...acc,
        [parent]: [...(acc[parent] ?? []), vector],
      };
    },
    {} as Record<string, VectorEntry[]>
  );

  return Object.entries(entriesByParent).map(
    ([name, vectors]) =>
      ({
        name,
        vectors,
      }) satisfies VectorCollection
  );
};

const shouldShow = (showOnlyChanges: boolean, changeType?: string) =>
  showOnlyChanges ? changeType !== undefined : true;

/**
 * Filter the library state based on the search term and show only changes
 * @param collectionEntries collection entries
 * @param vectorCollectionEntries vector collections
 * @param searchTerm search term
 * @param showOnlyChanges show only changes
 * @returns filtered collections and vectors
 *
 */
export const filterLibraryState = (
  collectionEntries: CollectionEntry[],
  vectorCollectionEntries: VectorCollection[],
  searchTerm: string,
  showOnlyChanges: boolean
) => {
  const filteredCollections: CollectionEntry[] = collectionEntries
    .map((collection) => {
      const filteredTokens = collection.tokens.filter((token) => {
        const tokenName = token.name.toLowerCase();
        const tokenDescription = token.description.toLowerCase();
        return (
          (tokenName.includes(searchTerm) ||
            tokenDescription.includes(searchTerm) ||
            token.errors.some((error) =>
              error.message.toLowerCase().includes(searchTerm)
            ) ||
            token.warnings.some((warning) =>
              warning.message.toLowerCase().includes(searchTerm)
            )) &&
          shouldShow(showOnlyChanges, token.changeType)
        );
      });
      return {
        ...collection,
        tokens: filteredTokens,
      };
    })
    .filter((collection) => collection.tokens.length > 0);

  const totalNumOfTokens = filteredCollections.reduce(
    (acc, collection) => acc + collection.tokens.length,
    0
  );

  const filteredVectors: VectorCollection[] = vectorCollectionEntries
    .map((collection) => {
      const filteredVectors = collection.vectors.filter((vector) => {
        const vectorName = vector.name.toLowerCase();
        const vectorDescription = vector.description.toLowerCase();
        const vectorProperties = Object.values(vector.properties)
          .join(" ")
          .toLowerCase();
        return (
          (vectorName.includes(searchTerm) ||
            vectorDescription.includes(searchTerm) ||
            vectorProperties.includes(searchTerm)) &&
          shouldShow(showOnlyChanges, vector.changeType)
        );
      });
      return {
        ...collection,
        vectors: filteredVectors,
      };
    })
    .filter((collection) => collection.vectors.length > 0);

  const totalNumOfVectors = filteredVectors.reduce(
    (acc, collection) => acc + collection.vectors.length,
    0
  );

  return {
    collections: filteredCollections,
    totalNumOfTokens,
    vectors: filteredVectors,
    totalNumOfVectors,
  };
};

/**
 * Creates a function that converts a token to a token entry
 * @param tokenLayers current token layers
 * @param oldTokenLayers previous version of token layers
 * @param tokenIssues array of token validation results
 * @param collectionName collection name
 * @param added array of added token names
 * @param modified array of modified token names
 * @param deleted array of deleted token names
 * @returns function that converts a token name object to a token entry
 */

const toTokenEntry = (
  tokenLayers: TokenLayers,
  oldTokenLayers: TokenLayers | undefined,
  tokenIssues: TokenValidationResult[],
  collectionName: string,
  added: string[],
  modified: string[],
  deleted: string[]
) => {
  return (token: TokenName): TokenEntry => {
    const { name, type, isAlias, values } = token;
    const description = name;
    const newValues = toTokenValues(name, tokenLayers.layers);
    const previousValues = toTokenValues(name, oldTokenLayers?.layers);
    const valuesPerMode = Object.entries(values ?? {}).reduce(
      (acc, [mode, value]) => {
        const layerName = formatLayerName(mode, collectionName);
        return {
          ...acc,
          [mode]: [
            newValues[layerName] ?? value,
            previousValues[layerName],
          ] as const,
        };
      },
      {} as Record<string, readonly [TokenValue, TokenValue | undefined]>
    );

    const { errors, warnings } = extractTokenIssues(
      tokenIssues,
      collectionName,
      name
    );

    return {
      errors,
      warnings,
      collection: collectionName,
      name,
      description,
      type,
      isAlias,
      values: values ?? {},
      valuesPerMode,
      changeType: added.includes(name)
        ? ("added" as const)
        : modified.includes(name)
          ? ("modified" as const)
          : deleted.includes(name)
            ? ("deleted" as const)
            : undefined,
    } satisfies TokenEntry;
  };
};

const renderTokenAlias = (
  { values, isAlias }: Pick<TokenEntry, "values" | "isAlias">,
  activeMode: string
) => {
  const value = values[activeMode];
  return isAlias && value && "alias" in value ? value.alias : undefined;
};

export const renderTokenValue = (
  { valuesPerMode }: TokenEntry,
  activeMode: string
) => {
  const [value, previousValue] =
    valuesPerMode && valuesPerMode[activeMode] ? valuesPerMode[activeMode] : [];
  const strValue =
    value && "value" in value && isString(value.value)
      ? value.value
      : undefined;
  const strPreviousValue =
    previousValue && "value" in previousValue && isString(previousValue.value)
      ? previousValue.value
      : undefined;
  return [strValue, strPreviousValue] as const;
};

export const isColor = (token: TokenEntry, activeMode: string) =>
  token.type.toLocaleLowerCase() === "color" && token.values[activeMode];

const extractTokenIssues = (
  tokenIssues: TokenValidationResult[],
  collectionName: string,
  tokenName: string
) => {
  const errors = tokenIssues
    .filter(
      (issue) =>
        issue.collection === collectionName &&
        issue.token.name === tokenName &&
        !issue.isWarning
    )
    .map((issue) => ({
      message: issue.message,
      segments: issue.offendingSegments,
      type: "error" as const,
    }));
  const warnings = tokenIssues
    .filter(
      (issue) =>
        issue.collection === collectionName &&
        issue.token.name === tokenName &&
        issue.isWarning
    )
    .map((issue) => ({
      message: issue.message,
      segments: issue.offendingSegments,
      type: "warning" as const,
    }));
  return { errors, warnings };
};
