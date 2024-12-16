import {
  TokenCollection,
  TokenLayers,
  FormatValidationResult,
  FormatName,
} from "radius-toolkit";
import { WidgetConfiguration } from "@repo/config";
import { SuccessfullyPushedDetails } from "../ui/components/success-panel";
import { RepositoryTokenLayers } from "../../types/state";

/**
 * Represents the loaded tokens data structure
 */
export type LoadedTokens = {
  inspectedAt: string;
  collections: TokenCollection[];
  tokenLayers?: TokenLayers;
};

/**
 * Represents the widget's state
 */
export type WidgetState = {
  configuration: WidgetConfiguration | null;
  errorMessage: string | null;
  tokenNameFormat: FormatName | null;
  synchDetails: RepositoryTokenLayers | null;
  successfullyPushed: SuccessfullyPushedDetails | null;
  persistedTokens: string | null;
  persistedVectors: string | null;
  loadedVectors: number | null;
  withVectors: boolean;
  allErrors: FormatValidationResult[];
};

/**
 * Type guard for widget configuration
 */
export const isValidConfiguration = (
  u: WidgetConfiguration | unknown,
): u is WidgetConfiguration => {
  return !!u;
};
