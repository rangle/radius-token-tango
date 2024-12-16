import { createLogger } from "@repo/utils";
import { FormatValidationResult, TokenNameFormatType, formats, FormatName } from "radius-toolkit";
import { getTokenLayers } from "../services/load-tokens.services";
import { useSyncedState } from "../types/figma-types";

const log = createLogger("WIDGET:tokens");

/**
 * Format a date into a local date-time string
 */
const formatDateTime = (d: Date): string => {
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
};

type TokenState = {
  persistedTokens: string | null;
  tokenNameFormat: FormatName | null;
  allErrors: FormatValidationResult[];
};

type TokenActions = {
  loadTokens: (format: TokenNameFormatType) => Promise<void>;
  setTokenNameFormat: (format: FormatName | null) => void;
};

export const useTokenManagement = (): [TokenState, TokenActions] => {
  const [persistedTokens, setPersistedTokens] = useSyncedState<string | null>(
    "persistedTokens",
    null,
  );
  const [tokenNameFormat, setTokenNameFormat] = useSyncedState<FormatName | null>(
    "tokenNameFormat",
    null,
  );
  const [allErrors, setAllErrors] = useSyncedState<FormatValidationResult[]>(
    "allErrors",
    [],
  );

  const loadTokens = async (format: TokenNameFormatType) => {
    log("debug", ">>> LOADING VARIABLES");
    const [collections, tokenLayers, errors] = await getTokenLayers(format, true);
    log("debug", tokenLayers);
    log("debug", errors);
    log("debug", ">>> SETTING STATE VARIABLES");
    
    const now = new Date();
    setPersistedTokens(
      JSON.stringify({ 
        collections, 
        tokenLayers, 
        inspectedAt: formatDateTime(now) 
      }),
    );
    log("debug", ">>> LOADED VARIABLES");
    setAllErrors(errors);
    log("debug", ">>> LOADED ERRORS");
  };

  return [
    { persistedTokens, tokenNameFormat, allErrors },
    { loadTokens, setTokenNameFormat }
  ];
}; 