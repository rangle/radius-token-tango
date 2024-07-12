import { TokenVariable, TokenValue } from "radius-toolkit";
import React, { FC, ReactNode, useContext, useState } from "react";
import { CollectionEntry, TokenEntry } from "../services/library.services";

import { createLogger } from "@repo/utils";

const log = createLogger("WEB:token-provider");

export type CollectionEntryState = {
  collection: CollectionEntry;
  activeMode: string;
};

export type TokenValueTuple = readonly [
  raw: TokenVariable["value"],
  strValue: string,
  strPrevious: string | undefined,
  alias: string | undefined,
];

export type TokenCollectionsContext = {
  collections: CollectionEntryState[];
  getActiveMode: (collection: string) => string;
  selectMode: (collection: string, mode: string) => void;
  getTokenFinalValue: (tokenName: string, alias?: string) => TokenValueTuple;
};

export const tokenCollectionsContext = React.createContext<
  TokenCollectionsContext | undefined
>(undefined);

export const useTokenCollections = () => {
  const context = useContext(tokenCollectionsContext);
  if (!context) {
    throw new Error(
      "useTokenCollections must be used within a TokenCollectionsProvider"
    );
  }
  return context;
};

export type TokenFinalValue = {
  alias?: string;
  raw: VariableValue | undefined;
  rendered: string | undefined;
  previous?: string;
};

export const toTokenFinalValue = (
  rawValue: TokenValue | undefined,
  renderedValue: TokenValue | undefined,
  previousValue: TokenValue | undefined,
  alias?: string
): TokenFinalValue => {
  if (!rawValue) {
    return {
      alias,
      raw: undefined,
      rendered: undefined,
    };
  }
  if ("alias" in rawValue)
    return {
      alias: rawValue.alias,
      raw: undefined,
      rendered: rawValue.alias,
    };
  return {
    alias,
    raw: rawValue.value,
    rendered:
      renderedValue && "value" in renderedValue
        ? String(renderedValue?.value)
        : String(rawValue.value),
    previous:
      previousValue && "value" in previousValue
        ? String(previousValue?.value)
        : undefined,
  };
};

export const TokenCollectionsProvider: FC<{
  collections: CollectionEntry[];
  children: ReactNode;
}> = ({ collections, children }) => {
  const [collectionEntries, setCollectionEntries] = useState<
    CollectionEntryState[]
  >(
    collections.map((collection) => ({
      collection,
      activeMode: collection.modes[0] ?? "",
    }))
  );

  const tokenFinalValuesByName = collectionEntries.reduce(
    (outer, { activeMode, collection: { tokens } }) => {
      return tokens.reduce(
        (acc, token) => {
          const value = token.values[activeMode];
          const [renderedValue, oldValue] =
            token.valuesPerMode?.[activeMode] ?? [];

          return {
            ...acc,
            [token.name]: toTokenFinalValue(value, renderedValue, oldValue),
          };
        },
        outer as Record<string, TokenFinalValue>
      );
    },
    {} as Record<string, TokenFinalValue>
  );

  const selectMode = (collection: string, mode: string) => {
    setCollectionEntries((prev) =>
      prev.map((entry) =>
        entry.collection.name === collection
          ? { ...entry, activeMode: mode }
          : entry
      )
    );
  };

  const getActiveMode = (collection: string) => {
    const entry = collectionEntries.find(
      (e) => e.collection.name === collection
    );
    return entry?.activeMode ?? "";
  };

  const getTokenFinalValue = (
    tokenName: string,
    alias?: string
  ): TokenValueTuple => {
    const finalValue = tokenFinalValuesByName[tokenName];
    log("warn", "getTokenValue", { tokenName, finalValue });
    if (!finalValue) return [undefined, "", "", alias];
    if (finalValue.alias) {
      return getTokenFinalValue(finalValue.alias, alias ?? finalValue.alias);
    }
    return [
      finalValue.raw,
      finalValue.rendered ?? "",
      finalValue.previous,
      alias,
    ];
  };

  return (
    <tokenCollectionsContext.Provider
      value={{
        collections: collectionEntries,
        selectMode,
        getActiveMode,
        getTokenFinalValue,
      }}
    >
      {children}
    </tokenCollectionsContext.Provider>
  );
};
